import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class PurchaseDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  productName: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'integer', nullable: true })
  productId: number | null;

  @ManyToOne(() => Product, (product) => product.purchaseDetails, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  product?: Product | null;

  @Column({ type: 'integer' })
  purchaseId: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchaseId' })
  purchase: Purchase;

  @CreateDateColumn()
  createdAt: Date;
}
