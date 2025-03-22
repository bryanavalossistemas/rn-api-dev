import { DocumentDetail } from '../../document-details/entities/document-detail.entity';
import { Document } from '../../documents/entities/document.entity';
import { Product } from '../../products/entities/product.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class InventoryMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movementType: 'entrada' | 'salida' | 'inicial' | 'ajuste';

  @Column({ type: 'integer' })
  referenceId: number;

  @Column({ type: 'integer' })
  referenceType: 'venta' | 'compra';

  @Column({ type: 'integer' })
  lastStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lastCost: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'integer' })
  resultingStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  resultingCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.inventoryMovements, {
    onDelete: 'CASCADE',
  })
  product: Relation<Product>;

  @ManyToOne(() => Document, (document) => document.inventoryMovements)
  document: Relation<Document>;

  @OneToOne(() => DocumentDetail, (documentDetail) => documentDetail.inventoryMovement)
  documentDetail: Relation<DocumentDetail>;
}
