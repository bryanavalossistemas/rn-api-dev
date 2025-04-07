import { InventoryMovementsService } from '@/admin/inventory/inventory-movements/inventory-movements.service';
import { ProductsService } from '@/admin/inventory/products/products.service';
import { CreatePurchaseDto } from '@/admin/transactions/purchases/dto/create-purchase.dto';
import { UpdatePurchaseDto } from '@/admin/transactions/purchases/dto/update-purchase.dto';
import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { SuppliersService } from '@/admin/transactions/suppliers/suppliers.service';
import { VoucherDetailsService } from '@/admin/transactions/voucher-details/voucher-details.service';
import { VouchersService } from '@/admin/transactions/vouchers/vouchers.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly suppliersService: SuppliersService,
    private readonly vouchersService: VouchersService,
    private readonly productsService: ProductsService,
    private readonly voucherDetailsService: VoucherDetailsService,
    private readonly inventoryMovementsService: InventoryMovementsService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const { documentType, supplierId, voucherDetails } = createPurchaseDto;
    const supplier = await this.suppliersService.findOneById(supplierId);

    const total = voucherDetails.reduce((accum, detail) => accum + detail.unitPrice * detail.quantity, 0);
    const subtotal = parseFloat((total / (1 + 0.18)).toFixed(2));
    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    const serie = this.vouchersService.getVoucherSerie(documentType);
    const number = await this.vouchersService.getNextVoucherNumberByLast('Compra', documentType);

    const voucher = await this.vouchersService.save({ total, subtotal, tax, documentType, serie, number, type: 'Compra' });

    const purchase = await this.purchasesRepository.save({ supplier, voucher });

    for (const { productId, unitPrice, quantity } of voucherDetails) {
      const product = await this.productsService.findOneById(productId);
      const stock = product.stock;

      const voucherDetail = await this.voucherDetailsService.save({
        voucher,
        product,
        quantity,
        unitPrice,
      });

      await this.inventoryMovementsService.save({
        movementType: 'IN',
        product,
        quantity,
        unitCost: unitPrice,
        voucherDetail,
      });

      product.stock = stock + quantity;
      await this.productsService.save(product);
    }

    return await this.purchasesRepository.findOne({
      where: { id: purchase.id },
      relations: { supplier: true, voucher: { voucherDetails: { product: true } } },
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Purchase> = {
      order: { id: 'DESC' },
      relations: { supplier: true, voucher: { voucherDetails: { product: true } } },
    };

    if (startDate && endDate) {
      options.where = { voucher: { createdAt: Between(startDate, endDate) } };
    }

    return await this.purchasesRepository.find(options);
  }

  async findOne(options: FindOneOptions<Purchase>) {
    const purchase = await this.purchasesRepository.findOne(options);
    if (!purchase) {
      throw new NotFoundException();
    }
    return purchase;
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const { documentType, supplierId, voucherDetails } = updatePurchaseDto;
    const purchase = await this.findOne({ where: { id }, relations: { voucher: true } });
    const voucher = purchase.voucher;

    if (documentType && voucher.documentType !== documentType) {
      const serie = this.vouchersService.getVoucherSerie(documentType);
      voucher.serie = serie;
      const number = await this.vouchersService.getNextVoucherNumberByLast('Compra', documentType);
      voucher.number = number;

      voucher.documentType = documentType;
    }

    if (supplierId && purchase.supplierId !== supplierId) {
      purchase.supplierId = supplierId;
      await this.purchasesRepository.save(purchase);
    }

    for (const { id, productId, quantity, unitPrice, deleted } of voucherDetails) {
      if (!id) {
        const product = await this.productsService.findOneById(productId);
        product.stock = product.stock + quantity;
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
          movementType: 'IN',
          voucherDetail,
          unitCost: unitPrice,
        });
      } else if (deleted) {
        const voucherDetail = await this.voucherDetailsService.findOneById(id);

        const product = await this.productsService.findOneById(productId);
        product.stock = product.stock - voucherDetail.quantity;
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
          originalProduct.stock = originalProduct.stock - voucherDetail.quantity;
          await this.productsService.save(originalProduct);
        } else {
          // Revertimos el stock del mismo producto
          product.stock = product.stock - voucherDetail.quantity;
        }

        // Actualizamos el stock con la nueva cantidad
        product.stock = product.stock + quantity;
        await this.productsService.save(product);

        const inventoryMovement = await this.inventoryMovementsService.findOne({ where: { voucherDetailId: voucherDetail.id } });

        inventoryMovement.product = product;
        inventoryMovement.quantity = quantity;
        inventoryMovement.unitCost = unitPrice;
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

    return await this.purchasesRepository.findOne({
      where: { id: purchase.id },
      relations: { supplier: true, voucher: { voucherDetails: { product: true } } },
    });
  }

  async remove(id: Purchase['id']) {
    const purchase = await this.purchasesRepository.findOneBy({ id });
    if (!purchase) {
      throw new NotFoundException();
    }

    const voucherDetails = await this.voucherDetailsService.find({ where: { voucher: { purchase: { id: purchase.id } } } });
    for (const { id, productId } of voucherDetails) {
      const voucherDetail = await this.voucherDetailsService.findOneById(id);

      const product = await this.productsService.findOneById(productId);
      product.stock = product.stock - voucherDetail.quantity;
      await this.productsService.save(product);
    }

    await this.vouchersService.remove(purchase.voucherId);

    return { message: 'Compra eliminada correctamente' };
  }
}
