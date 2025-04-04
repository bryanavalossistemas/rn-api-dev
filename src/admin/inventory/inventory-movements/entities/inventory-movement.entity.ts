import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  documentType: 'Purchase' | 'Sale';

  @Column({ type: 'integer' })
  documentId: number;

  @Column({ type: 'integer' })
  detailId: number;

  @Column({ type: 'integer' })
  previousStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  previousCost: number;

  @Column({ type: 'integer' })
  lastStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lastCost: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'integer' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.inventoryMovements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
