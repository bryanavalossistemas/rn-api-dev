import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '@/admin/transactions/sales/entities/sale.entity';
import { Between, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CustomersService } from '@/admin/transactions/customers/customers.service';
import { VouchersService } from '@/admin/transactions/vouchers/vouchers.service';
import { ProductsService } from '@/admin/inventory/products/products.service';
import { CreateSaleDto } from '@/admin/transactions/sales/dto/create-sale.dto';
import { UpdateSaleDto } from '@/admin/transactions/sales/dto/update-sale.dto';
import { InventoryMovementsService } from '@/admin/inventory/inventory-movements/inventory-movements.service';
import { VoucherDetailsService } from '@/admin/transactions/voucher-details/voucher-details.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    private readonly customersService: CustomersService,
    private readonly vouchersService: VouchersService,
    private readonly productsService: ProductsService,
    private readonly voucherDetailsService: VoucherDetailsService,
    private readonly inventoryMovementsService: InventoryMovementsService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const { documentType, customerId, voucherDetails } = createSaleDto;
    const customer = await this.customersService.findOneById(customerId);

    const total = voucherDetails.reduce((accum, detail) => accum + detail.unitPrice * detail.quantity, 0);
    const subtotal = parseFloat((total / (1 + 0.18)).toFixed(2));
    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    const serie = this.vouchersService.getVoucherSerie(documentType);
    const number = await this.vouchersService.getNextVoucherNumberByLast('Venta', documentType);

    const voucher = await this.vouchersService.save({ total, subtotal, tax, documentType, serie, number, type: 'Venta' });

    const sale = await this.salesRepository.save({ customer, voucher });

    for (const { productId, unitPrice, quantity } of voucherDetails) {
      const product = await this.productsService.findOneById(productId);
      const stock = product.stock;
      product.stock = stock - quantity;
      await this.productsService.save(product);

      const voucherDetail = await this.voucherDetailsService.save({
        voucher,
        product,
        quantity,
        unitPrice,
      });

      await this.inventoryMovementsService.save({
        movementType: 'OUT',
        product,
        quantity,
        unitCost: await this.inventoryMovementsService.getAverageCost(product.id, new Date()),
        voucherDetail,
      });
    }

    return await this.salesRepository.findOne({
      where: { id: sale.id },
      relations: { customer: true, voucher: { voucherDetails: { product: true } } },
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Sale> = {
      order: { id: 'DESC' },
      relations: { customer: true, voucher: { voucherDetails: { product: true } } },
    };

    if (startDate && endDate) {
      options.where = { voucher: { createdAt: Between(startDate, endDate) } };
    }

    return await this.salesRepository.find(options);
  }

  async findOne(options: FindOneOptions<Sale>) {
    const sale = await this.salesRepository.findOne(options);
    if (!sale) {
      throw new NotFoundException();
    }
    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    const { documentType, customerId, voucherDetails } = updateSaleDto;
    const sale = await this.findOne({ where: { id }, relations: { voucher: true } });
    const voucher = sale.voucher;

    if (documentType && voucher.documentType !== documentType) {
      const serie = this.vouchersService.getVoucherSerie(documentType);
      voucher.serie = serie;
      const number = await this.vouchersService.getNextVoucherNumberByLast('Venta', documentType);
      voucher.number = number;

      voucher.documentType = documentType;
    }

    if (customerId && sale.customerId !== customerId) {
      sale.customerId = customerId;
      await this.salesRepository.save(sale);
    }

    for (const { id, productId, quantity, unitPrice, deleted } of voucherDetails) {
      if (!id) {
        const product = await this.productsService.findOneById(productId);
        product.stock = product.stock - quantity;
        await this.productsService.save(product);

        const voucherDetail = await this.voucherDetailsService.save({
          product,
          unitPrice,
          quantity,
          voucher,
        });

        await this.inventoryMovementsService.save({
          product,
          quantity,
          movementType: 'OUT',
          voucherDetail,
          unitCost: await this.inventoryMovementsService.getAverageCost(product.id, sale.createdAt),
        });
      } else if (deleted) {
        const voucherDetail = await this.voucherDetailsService.findOneById(id);

        const product = await this.productsService.findOneById(productId);
        product.stock = product.stock + voucherDetail.quantity;
        await this.productsService.save(product);

        // Eliminamos el detalle (y sus movimientos en cascada)
        await this.voucherDetailsService.remove(voucherDetail);
      } else if (id && !deleted) {
        // Procesa la actualización de un detalle de comprobante
        const voucherDetail = await this.voucherDetailsService.findOneById(id);
        const product = await this.productsService.findOneById(productId);

        // Manejamos el cambio de producto
        if (voucherDetail.productId !== productId) {
          // Revertimos el stock del producto anterior
          const originalProduct = await this.productsService.findOneById(voucherDetail.productId);
          originalProduct.stock = originalProduct.stock + voucherDetail.quantity;
          await this.productsService.save(originalProduct);
        } else {
          // Revertimos el stock del mismo producto
          product.stock = product.stock + voucherDetail.quantity;
        }

        // Actualizamos el stock con la nueva cantidad
        product.stock = product.stock - quantity;
        await this.productsService.save(product);

        const inventoryMovement = await this.inventoryMovementsService.findOne({ where: { voucherDetailId: voucherDetail.id } });

        inventoryMovement.product = product;
        inventoryMovement.quantity = quantity;
        inventoryMovement.unitCost = unitPrice;
        inventoryMovement.unitCost = await this.inventoryMovementsService.getAverageCost(product.id, sale.createdAt);
        await this.inventoryMovementsService.save(inventoryMovement);

        voucherDetail.product = product;
        voucherDetail.quantity = quantity;
        voucherDetail.unitPrice = unitPrice;
        await this.voucherDetailsService.save(voucherDetail);
      }
    }

    // Recargamos los detalles para calcular los totales
    const newVoucherDetails = await this.voucherDetailsService.find({ where: { voucherId: voucher.id } });

    // CALCULAMOS NUEVOS TOTALES
    const total = newVoucherDetails.reduce((accum, detail) => accum + detail.unitPrice * detail.quantity, 0);
    const subtotal = parseFloat((total / (1 + 0.18)).toFixed(2));
    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    voucher.total = total;
    voucher.subtotal = subtotal;
    voucher.tax = tax;

    await this.vouchersService.save(voucher);

    return await this.salesRepository.findOne({
      where: { id: sale.id },
      relations: { customer: true, voucher: { voucherDetails: { product: true } } },
    });
  }

  async remove(id: number) {
    const sale = await this.salesRepository.findOneBy({ id });
    if (!sale) {
      throw new NotFoundException();
    }

    const voucherDetails = await this.voucherDetailsService.find({ where: { voucher: { sale: { id: sale.id } } } });
    for (const { id, productId } of voucherDetails) {
      const voucherDetail = await this.voucherDetailsService.findOneById(id);

      const product = await this.productsService.findOneById(productId);
      product.stock = product.stock + voucherDetail.quantity;
      await this.productsService.save(product);
    }

    await this.vouchersService.remove(sale.voucherId);

    return { message: 'Venta eliminada correctamente' };
  }
}
