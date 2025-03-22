import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { DocumentsService } from '../documents/documents.service';
import { ProductsService } from '../products/products.service';
import { InventoryMovementsService } from '../inventory-movements/inventory-movements.service';
import { DocumentDetailsService } from '../document-details/document-details.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Between, FindManyOptions, FindOneOptions, MoreThan, Repository } from 'typeorm';
import { UpdateDocumentDetailDto } from '../document-details/dto/update-document-detail.dto';
import { DocumentDetail } from '../document-details/entities/document-detail.entity';
import { SuppliersService } from '../suppliers/suppliers.service';
import { DocumentTypesService } from '../document-types/document-types.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly documentsService: DocumentsService,
    private readonly productsService: ProductsService,
    private readonly inventoryMovementsService: InventoryMovementsService,
    private readonly documentDetailsService: DocumentDetailsService,
    private readonly suppliersService: SuppliersService,
    private readonly documentTypesService: DocumentTypesService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: number) {
    const { documentTypeId, supplierId, documentDetails } = createPurchaseDto;

    const numberOfDocument = (await this.documentsService.countByDocumentTypeId(documentTypeId)) + 1;

    const total = documentDetails.reduce((accumulator, documentDetail) => accumulator + documentDetail.unitPrice * documentDetail.quantity, 0);
    const subtotal = parseFloat((total / (1 + 0.18)).toFixed(2));
    const tax = parseFloat((subtotal * 0.18).toFixed(2));

    const document = await this.documentsService.save({
      documentType: { id: documentTypeId },
      documentSerie: documentTypeId === 1 ? 'F001' : 'B001',
      documentNumber: numberOfDocument.toString().padStart(8, '0'),
      subtotal: subtotal,
      tax: tax,
      total: total,
      user: { id: userId },
    });

    const supplier = await this.suppliersService.findOne(supplierId);

    const purchase = await this.purchasesRepository.save({
      supplier: { id: supplier.id },
      supplierName: supplier.name,
      supplierDocument: supplier.document,
      document: document,
    });

    for (const documentDetail of documentDetails) {
      const product = await this.productsService.findOne({
        where: { id: documentDetail.productId },
      });
      const { costPrice: currentCost, stock: currentStock } = product;
      const { quantity, unitPrice } = documentDetail;

      const resultingCost = parseFloat(((currentCost * currentStock + unitPrice * quantity) / (currentStock + quantity)).toFixed(2));
      const resultingStock = currentStock + quantity;

      const inventoryMovement = await this.inventoryMovementsService.save({
        movementType: 'entrada',
        lastCost: currentCost,
        lastStock: currentStock,
        quantity: quantity,
        unitPrice: unitPrice,
        resultingCost: resultingCost,
        resultingStock: resultingStock,
        document: document,
        product: product,
        referenceType: 'compra',
        referenceId: purchase.id,
      });
      product.costPrice = resultingCost;
      product.stock = resultingStock;

      await this.documentDetailsService.save({
        productName: product.name,
        product: product,
        quantity: quantity,
        unitPrice: unitPrice,
        document: document,
        inventoryMovement: { id: inventoryMovement.id },
      });

      await this.productsService.save(product);
    }

    return await this.purchasesRepository.findOne({
      where: { id: purchase.id },
      relations: ['supplier', 'document', 'document.documentType', 'document.documentDetails', 'document.documentDetails.product'],
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Purchase> = {
      order: { id: 'DESC' },
      relations: ['supplier', 'document', 'document.documentType', 'document.documentDetails', 'document.documentDetails.product'],
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
    const { documentTypeId, supplierId, documentDetails } = updatePurchaseDto;

    const purchase = await this.findOne({
      where: { id: id },
      relations: ['document'],
    });

    const document = await this.documentsService.findOne({
      where: { id: purchase.document.id },
    });

    if (documentTypeId) {
      const documentType = await this.documentTypesService.findById(documentTypeId);

      await this.documentsService.save({
        id: document.id,
        documentType: { id: documentType.id },
      });
    }

    if (supplierId) {
      const supplier = await this.suppliersService.findOne(supplierId);

      await this.purchasesRepository.save({
        id: purchase.id,
        supplier: { id: supplier.id },
        supplierName: supplier.name,
        supplierDocument: supplier.document,
      });

      purchase.supplierName = supplier.name;
      purchase.supplierDocument = supplier.document;
    }

    const originalDetails = await this.documentDetailsService.find({
      where: { document: { id: document.id } },
      relations: ['product', 'inventoryMovement'],
    });
    const originalDetailsMap = new Map(originalDetails.map((detail) => [detail.id, detail]));

    const detailsToAdd: UpdateDocumentDetailDto[] = [];
    const detailsToUpdate: {
      id: number;
      originalDetail: DocumentDetail;
      newData: UpdateDocumentDetailDto;
    }[] = [];
    const detailsToDelete: DocumentDetail[] = [];

    for (const detail of documentDetails) {
      if (!detail.id) {
        detailsToAdd.push(detail);
      } else if (detail.deleted) {
        const originalDetail = originalDetailsMap.get(detail.id);
        if (originalDetail) {
          detailsToDelete.push(originalDetail);
        }
      } else {
        const originalDetail = originalDetailsMap.get(detail.id);
        if (originalDetail) {
          detailsToUpdate.push({
            id: originalDetail.id,
            originalDetail,
            newData: detail,
          });
        }
      }
    }

    for (const detailToDelete of detailsToDelete) {
      const productId = detailToDelete.product.id;
      const originalMovement = await this.inventoryMovementsService.findOne({
        where: {
          id: detailToDelete.inventoryMovement.id,
          document: { id: document.id },
        },
      });

      await this.inventoryMovementsService.save({
        id: originalMovement.id,
        resultingStock: originalMovement.lastStock,
        resultingCost: originalMovement.lastCost,
      });

      await this.productsService.save({
        id: productId,
        stock: originalMovement.lastStock,
        costPrice: originalMovement.lastCost,
      });

      await this.recalculateSubsequentMovements(productId, originalMovement.id);

      await this.documentDetailsService.delete({ id: detailToDelete.id });

      await this.inventoryMovementsService.delete({ id: originalMovement.id });
    }

    for (const { id, originalDetail, newData } of detailsToUpdate) {
      const { productId, quantity, unitPrice } = newData;

      if (originalDetail.quantity !== quantity || originalDetail.unitPrice !== unitPrice) {
        const originalMovement = await this.inventoryMovementsService.findOne({
          where: {
            document: { id: document.id },
            id: originalDetail.inventoryMovement.id,
          },
        });

        const initialState = {
          stock: originalMovement.lastStock,
          costPrice: originalMovement.lastCost,
        };
        const newResultingStock = initialState.stock + quantity;
        const newResultingCost = parseFloat(((initialState.costPrice * initialState.stock + unitPrice * quantity) / newResultingStock).toFixed(2));

        await this.inventoryMovementsService.save({
          id: originalMovement.id,
          quantity,
          unitPrice,
          resultingStock: newResultingStock,
          resultingCost: newResultingCost,
        });

        await this.documentDetailsService.save({
          id,
          quantity,
          unitPrice,
        });

        await this.recalculateSubsequentMovements(productId, originalMovement.id);
      }
    }

    for (const detailToAdd of detailsToAdd) {
      const { productId, quantity, unitPrice } = detailToAdd;

      const product = await this.productsService.findOne({
        where: { id: productId },
      });

      const currentState = {
        stock: product.stock,
        costPrice: product.costPrice,
      };

      const newResultingStock = currentState.stock + quantity;
      const newResultingCost = parseFloat(((currentState.costPrice * currentState.stock + unitPrice * quantity) / newResultingStock).toFixed(2));

      const movement = await this.inventoryMovementsService.save({
        movementType: 'entrada',
        lastCost: currentState.costPrice,
        lastStock: currentState.stock,
        quantity: quantity,
        unitPrice: unitPrice,
        resultingCost: newResultingCost,
        resultingStock: newResultingStock,
        document: { id: document.id },
        product: { id: product.id },
        referenceType: 'compra',
        referenceId: purchase.id,
      });

      await this.documentDetailsService.save({
        product: { id: product.id },
        productName: product.name,
        quantity: quantity,
        unitPrice: unitPrice,
        document: { id: document.id },
        inventoryMovement: { id: movement.id },
      });

      await this.productsService.save({
        id: productId,
        stock: newResultingStock,
        costPrice: newResultingCost,
      });
    }

    const updatedDetails = await this.documentDetailsService.find({
      where: { document: { id: document.id } },
    });
    const newTotal = updatedDetails.reduce((acc, detail) => acc + detail.quantity * detail.unitPrice, 0);
    const newSubtotal = parseFloat((newTotal / (1 + 0.18)).toFixed(2));
    const newTax = parseFloat((newSubtotal * 0.18).toFixed(2));

    await this.documentsService.save({
      id: document.id,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
    });

    return await this.purchasesRepository.findOne({
      where: { id: purchase.id },
      relations: ['supplier', 'document', 'document.documentType', 'document.documentDetails', 'document.documentDetails.product'],
    });
  }

  async remove(id: number) {
    const purchase = await this.findOne({
      where: { id: id },
      relations: ['document'],
    });

    const document = await this.documentsService.findOne({
      where: { id: purchase.document.id },
    });

    const documentDetails = await this.documentDetailsService.find({
      where: { document: { id: document.id } },
      relations: ['product', 'inventoryMovement'],
    });

    for (const detail of documentDetails) {
      const productId = detail.product.id;

      const originalMovement = await this.inventoryMovementsService.findOne({
        where: { id: detail.inventoryMovement.id, product: { id: productId } },
      });

      await this.inventoryMovementsService.save({
        id: originalMovement.id,
        resultingStock: originalMovement.lastStock,
        resultingCost: originalMovement.lastCost,
      });

      await this.productsService.save({
        id: productId,
        stock: originalMovement.lastStock,
        costPrice: originalMovement.lastCost,
      });

      await this.recalculateSubsequentMovements(productId, originalMovement.id);

      await this.documentDetailsService.delete({ id: detail.id });

      await this.inventoryMovementsService.delete({ id: originalMovement.id });
    }

    await this.purchasesRepository.delete({ id: id });

    await this.documentsService.delete({ id: document.id });

    return {
      message: 'La compra se ha eliminado correctamente',
    };
  }

  private async recalculateSubsequentMovements(productId: number, afterMovementId: number) {
    const referenceMovement = await this.inventoryMovementsService.findOne({
      where: { id: afterMovementId },
    });

    if (!referenceMovement) {
      throw new NotFoundException(`No se encontró el movimiento con ID ${afterMovementId}`);
    }

    const subsequentMovements = await this.inventoryMovementsService.find({
      where: {
        product: { id: productId },
        id: MoreThan(referenceMovement.id),
      },
      order: { id: 'ASC' },
    });

    let currentStock = referenceMovement.resultingStock;
    let currentCost = referenceMovement.resultingCost;

    for (const movement of subsequentMovements) {
      const lastStock = currentStock;
      const lastCost = currentCost;

      if (movement.movementType === 'entrada') {
        currentStock = lastStock + movement.quantity;
        currentCost = parseFloat(((lastCost * lastStock + movement.unitPrice * movement.quantity) / currentStock).toFixed(2));
      } else if (movement.movementType === 'salida') {
        currentStock = lastStock - movement.quantity;
      } else if (movement.movementType === 'ajuste') {
        if (movement.quantity < 0) {
          currentStock = lastStock + movement.quantity;
          currentCost = parseFloat(((lastCost * lastStock + movement.unitPrice * movement.quantity) / currentStock).toFixed(2));
        } else {
          currentStock = lastStock + movement.quantity;
        }
      }

      await this.inventoryMovementsService.save({
        id: movement.id,
        lastStock: lastStock,
        lastCost: lastCost,
        resultingStock: currentStock,
        resultingCost: currentCost,
      });
    }

    await this.productsService.save({
      id: productId,
      stock: currentStock,
      costPrice: currentCost,
    });
  }
}
