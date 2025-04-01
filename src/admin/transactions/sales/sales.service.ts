import { InventoryMovementsService } from '@/admin/inventory/inventory-movements/inventory-movements.service';
import { ProductsService } from '@/admin/inventory/products/products.service';
import { CustomersService } from '@/admin/transactions/customers/customers.service';
import { SaleDetailsService } from '@/admin/transactions/sale-details/sale-details.service';
import { CreateSaleDto } from '@/admin/transactions/sales/dto/create-sale.dto';
import { UpdateSaleDto } from '@/admin/transactions/sales/dto/update-sale.dto';
import { Sale } from '@/admin/transactions/sales/entities/sale.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    private readonly productsService: ProductsService,
    private readonly inventoryMovementsService: InventoryMovementsService,
    private readonly saleDetailsService: SaleDetailsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const { customerId, documentType, saleDetails } = createSaleDto;

    const numberOfDocument = (await this.salesRepository.countBy({ documentType: documentType })) + 1;

    const total = saleDetails.reduce((accumulator, saleDetail) => accumulator + saleDetail.unitPrice * saleDetail.quantity, 0);
    const subtotal = parseFloat((total / (1 + 0.18)).toFixed(2));
    const tax = parseFloat((subtotal * 0.18).toFixed(2));

    const customer = await this.customersService.findOneById(customerId);

    const sale = await this.salesRepository.save({
      documentType: documentType,
      documentNumber:
        documentType === 'Factura'
          ? `F001 - ${numberOfDocument.toString().padStart(8, '0')}`
          : `B001 - ${numberOfDocument.toString().padStart(8, '0')}`,
      subtotal: subtotal,
      tax: tax,
      total: total,
      customerId: customer.id,
      customerName: customer.name,
      customerDocumentNumber: customer.documentNumber,
    });

    for (const documentDetail of saleDetails) {
      const { quantity, unitPrice, productId, productName } = documentDetail;
      const product = await this.productsService.findOneById(productId);
      const { stock, costPrice } = product;

      const newStock = stock + quantity;

      const newSaleDetail = await this.saleDetailsService.save({
        productId: product.id,
        productName: productName,
        quantity: quantity,
        unitPrice: unitPrice,
        costPrice: costPrice,
        saleId: sale.id,
      });

      await this.inventoryMovementsService.save({
        documentType: 'Sale',
        documentId: sale.id,
        detailId: newSaleDetail.id,
        product: { id: product.id },
        quantity: quantity,
        unitPrice: unitPrice,
        previousStock: stock,
        previousCost: costPrice,
        lastStock: newStock,
        lastCost: costPrice,
      });
      product.stock = newStock;

      await this.productsService.save(product);
    }

    return await this.salesRepository.findOne({
      where: { id: sale.id },
      relations: { customer: true, saleDetails: { product: true } },
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Sale> = {
      order: { id: 'DESC' },
      relations: { customer: true, saleDetails: { product: true } },
    };
    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
    }
    return await this.salesRepository.find(options);
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
