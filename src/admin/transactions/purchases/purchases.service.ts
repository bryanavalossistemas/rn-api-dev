import { InventoryMovement } from '@/admin/inventory/inventory-movements/entities/inventory-movement.entity';
import { InventoryMovementsService } from '@/admin/inventory/inventory-movements/inventory-movements.service';
import { ProductsService } from '@/admin/inventory/products/products.service';
import { UpdatePurchaseDetailDto } from '@/admin/transactions/purchase-details/dto/update-purchase-detail.dto';
import { PurchaseDetail } from '@/admin/transactions/purchase-details/entities/purchase-detail.entity';
import { PurchaseDetailsService } from '@/admin/transactions/purchase-details/purchase-details.service';
import { CreatePurchaseDto } from '@/admin/transactions/purchases/dto/create-purchase.dto';
import { UpdatePurchaseDto } from '@/admin/transactions/purchases/dto/update-purchase.dto';
import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { SaleDetailsService } from '@/admin/transactions/sale-details/sale-details.service';
import { SuppliersService } from '@/admin/transactions/suppliers/suppliers.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOneOptions, MoreThan, Repository } from 'typeorm';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly productsService: ProductsService,
    private readonly inventoryMovementsService: InventoryMovementsService,
    private readonly purchaseDetailsService: PurchaseDetailsService,
    private readonly saleDetailsService: SaleDetailsService,
    private readonly suppliersService: SuppliersService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const { supplierId, documentType, purchaseDetails } = createPurchaseDto;

    const numberOfDocument = (await this.purchasesRepository.countBy({ documentType: documentType })) + 1;

    const total = purchaseDetails.reduce((accumulator, purchaseDetail) => accumulator + purchaseDetail.unitPrice * purchaseDetail.quantity, 0);
    const subtotal = parseFloat((total / (1 + 0.18)).toFixed(2));
    const tax = parseFloat((subtotal * 0.18).toFixed(2));

    const supplier = await this.suppliersService.findOneById(supplierId);

    const purchase = await this.purchasesRepository.save({
      documentType: documentType,
      documentNumber:
        documentType === 'Factura'
          ? `F001 - ${numberOfDocument.toString().padStart(8, '0')}`
          : `B001 - ${numberOfDocument.toString().padStart(8, '0')}`,
      subtotal: subtotal,
      tax: tax,
      total: total,
      supplierId: supplier.id,
      supplierDocumentNumber: supplier.documentNumber,
      supplierName: supplier.name,
    });

    for (const purchaseDetail of purchaseDetails) {
      const { quantity, unitPrice, productId, productName } = purchaseDetail;
      const product = await this.productsService.findOneById(productId);
      const { stock: currentStock, costPrice: currentCost } = product;

      const lastStock = currentStock + quantity;
      const lastCost = parseFloat(((currentCost * currentStock + unitPrice * quantity) / (currentStock + quantity)).toFixed(2));

      const newPurchaseDetail = await this.purchaseDetailsService.save({
        productId: product.id,
        purchaseId: purchase.id,
        productName: productName,
        quantity: quantity,
        unitPrice: unitPrice,
      });

      await this.inventoryMovementsService.save({
        previousStock: currentStock,
        previousCost: currentCost,
        lastStock: lastStock,
        lastCost: lastCost,
        detailId: newPurchaseDetail.id,
        documentType: 'Purchase',
        documentId: purchase.id,
        productId: product.id,
        quantity: quantity,
        unitPrice: unitPrice,
      });
      product.stock = lastStock;
      product.costPrice = lastCost;

      await this.productsService.save(product);
    }

    return await this.purchasesRepository.findOne({
      where: { id: purchase.id },
      relations: { purchaseDetails: { product: true } },
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Purchase> = {
      order: { id: 'DESC' },
      relations: { purchaseDetails: { product: true } },
    };
    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
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
    const { documentType, supplierId, purchaseDetails } = updatePurchaseDto;

    const purchase = await this.findOne({ where: { id: id } });

    if (documentType) {
      purchase.documentType = documentType;
      await this.purchasesRepository.save(purchase);
    }

    if (supplierId) {
      const supplier = await this.suppliersService.findOneById(supplierId);

      await this.purchasesRepository.save({
        id: purchase.id,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierDocumentNumber: supplier.documentNumber,
      });
    }

    const originalDetails = await this.purchaseDetailsService.find({
      where: { purchaseId: purchase.id },
    });
    const originalDetailsMap = new Map(originalDetails.map((detail) => [detail.id, detail]));

    const detailsToAdd: UpdatePurchaseDetailDto[] = [];
    const detailsToUpdate: {
      id: number;
      originalDetail: PurchaseDetail;
      newData: UpdatePurchaseDetailDto;
    }[] = [];
    const detailsToDelete: PurchaseDetail[] = [];

    for (const purchaseDetail of purchaseDetails) {
      if (!purchaseDetail.id) {
        detailsToAdd.push(purchaseDetail);
      } else if (purchaseDetail.deleted) {
        const originalDetail = originalDetailsMap.get(purchaseDetail.id);
        if (originalDetail) {
          detailsToDelete.push(originalDetail);
        }
      } else {
        const originalDetail = originalDetailsMap.get(purchaseDetail.id);
        if (originalDetail) {
          detailsToUpdate.push({
            id: originalDetail.id,
            originalDetail: originalDetail,
            newData: purchaseDetail,
          });
        }
      }
    }

    for (const detailToDelete of detailsToDelete) {
      const productId = detailToDelete.productId;
      if (productId) {
        const originalMovement = await this.inventoryMovementsService.findOne({
          where: {
            documentType: 'Purchase',
            documentId: purchase.id,
            detailId: detailToDelete.id,
            productId: productId,
          },
        });

        await this.inventoryMovementsService.save({
          id: originalMovement.id,
          lastStock: originalMovement.previousStock,
          lastCost: originalMovement.previousCost,
        });

        await this.productsService.save({
          id: productId,
          stock: originalMovement.previousStock,
          costPrice: originalMovement.previousCost,
        });

        await this.recalculateSubsequentMovements(originalMovement.id);

        await this.purchaseDetailsService.delete({ id: detailToDelete.id });

        await this.inventoryMovementsService.delete({ id: originalMovement.id });
      }
    }

    for (const { id, originalDetail, newData } of detailsToUpdate) {
      const originalMovement = await this.inventoryMovementsService.findOne({
        where: {
          documentType: 'Purchase',
          documentId: purchase.id,
          detailId: originalDetail.id,
          productId: originalDetail.id,
        },
      });

      const { productId, quantity, unitPrice, productName } = newData;

      // SI LA MODIFICACION FUE AL PRODUCTO, DEBE RECALCULAR EL PRODUCTO MODIFICADO COMO SI HUBIERA SIDO ELIMINADO SE USAL EL PRODUCT ID ORIGINAL
      if (originalMovement.productId !== productId) {
        await this.inventoryMovementsService.save({
          id: originalMovement.id,
          lastStock: originalMovement.previousStock,
          lastCost: originalMovement.previousCost,
        });

        if (originalDetail.productId) {
          await this.productsService.save({
            id: originalDetail.productId,
            stock: originalMovement.previousStock,
            costPrice: originalMovement.previousCost,
          });
        }

        await this.recalculateSubsequentMovements(originalMovement.id);
      }

      if (originalDetail.quantity !== quantity || originalDetail.unitPrice !== unitPrice) {
        const initialState = {
          stock: originalMovement.previousStock,
          costPrice: originalMovement.previousCost,
        };
        const newResultingStock = initialState.stock + quantity;
        const newResultingCost = parseFloat(((initialState.costPrice * initialState.stock + unitPrice * quantity) / newResultingStock).toFixed(2));

        // AQUI ESTAMOS USANDO EL PRODUCTO ID SI ES QUE SE MODIFICO EL PRODUCTO DEL DETALLE Y SI NO, NO HAY PROBLEMA
        await this.inventoryMovementsService.save({
          id: originalMovement.id,
          quantity: quantity,
          unitPrice: unitPrice,
          lastStock: newResultingStock,
          lastCost: newResultingCost,
          productId: productId,
        });

        await this.purchaseDetailsService.save({
          id: id,
          productId: productId,
          productName: productName,
          quantity: quantity,
          unitPrice: unitPrice,
        });

        await this.recalculateSubsequentMovements(originalMovement.id);
      }
    }

    for (const detailToAdd of detailsToAdd) {
      const { productId, quantity, unitPrice, productName } = detailToAdd;

      const product = await this.productsService.findOne({
        where: { id: productId },
      });

      const currentState = {
        stock: product.stock,
        costPrice: product.costPrice,
      };

      const newResultingStock = currentState.stock + quantity;
      const newResultingCost = parseFloat(((currentState.costPrice * currentState.stock + unitPrice * quantity) / newResultingStock).toFixed(2));

      const purchaseDetail = await this.purchaseDetailsService.save({
        productId: product.id,
        productName: productName,
        quantity: quantity,
        unitPrice: unitPrice,
        purchaseId: purchase.id,
      });

      await this.inventoryMovementsService.save({
        documentType: 'Purchase',
        documentId: purchase.id,
        previousStock: currentState.stock,
        previousCost: currentState.costPrice,
        lastStock: newResultingStock,
        lastCost: newResultingCost,
        quantity: quantity,
        unitPrice: unitPrice,
        productId: product.id,
        detailId: purchaseDetail.id,
      });

      await this.productsService.save({
        id: productId,
        stock: newResultingStock,
        costPrice: newResultingCost,
      });
    }

    const updatedDetails = await this.purchaseDetailsService.find({
      where: { purchaseId: purchase.id },
    });
    const newTotal = updatedDetails.reduce((acc, detail) => acc + detail.quantity * detail.unitPrice, 0);
    const newSubtotal = parseFloat((newTotal / (1 + 0.18)).toFixed(2));
    const newTax = parseFloat((newSubtotal * 0.18).toFixed(2));

    await this.purchasesRepository.save({
      id: purchase.id,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
    });

    return await this.purchasesRepository.findOne({
      where: { id: purchase.id },
      relations: { purchaseDetails: { product: true } },
    });
  }

  async remove(id: number) {
    const purchase = await this.findOne({
      where: { id: id },
      relations: { purchaseDetails: { product: true } },
    });

    const purchaseDetails = purchase.purchaseDetails;

    for (const purchaseDetail of purchaseDetails) {
      const productId = purchaseDetail.productId;

      if (productId) {
        const originalMovement = await this.inventoryMovementsService.findOne({
          where: { documentType: 'Purchase', documentId: purchase.id, detailId: purchaseDetail.id, productId: productId },
        });

        await this.inventoryMovementsService.save({
          id: originalMovement.id,
          lastStock: originalMovement.previousStock,
          lastCost: originalMovement.previousCost,
        });

        await this.productsService.save({
          id: productId,
          stock: originalMovement.previousStock,
          costPrice: originalMovement.previousCost,
        });

        await this.recalculateSubsequentMovements(originalMovement.id);

        await this.purchaseDetailsService.delete({ id: purchaseDetail.id });

        await this.inventoryMovementsService.delete({ id: originalMovement.id });
      }
    }

    await this.purchasesRepository.delete({ id: id });

    return {
      message: 'La compra se ha eliminado correctamente',
    };
  }

  private async recalculateSubsequentMovements(inventoryMovementId: InventoryMovement['id']) {
    const inventoryMovement = await this.inventoryMovementsService.findOne({ where: { id: inventoryMovementId } });

    const produtId = inventoryMovement.productId;
    const subsequentMovements = await this.inventoryMovementsService.find({
      where: {
        productId: produtId,
        id: MoreThan(inventoryMovement.id),
      },
      order: { id: 'ASC' },
    });

    let currentStock = inventoryMovement.lastStock;
    let currentCost = inventoryMovement.lastCost;

    for (const movement of subsequentMovements) {
      const lastStock = currentStock;
      const lastCost = currentCost;

      if (movement.documentType === 'Purchase') {
        currentStock = lastStock + movement.quantity;
        currentCost = parseFloat(((lastCost * lastStock + movement.unitPrice * movement.quantity) / currentStock).toFixed(2));
      } else if (movement.documentType === 'Sale') {
        currentStock = lastStock - movement.quantity;
        await this.saleDetailsService.save({ id: movement.detailId, costPrice: lastCost });
      }

      await this.inventoryMovementsService.save({
        id: movement.id,
        previousStock: lastStock,
        previousCost: lastCost,
        lastStock: currentStock,
        lastCost: currentCost,
      });
    }

    await this.productsService.save({
      id: produtId,
      stock: currentStock,
      costPrice: currentCost,
    });
  }
}
