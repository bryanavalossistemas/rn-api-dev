import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Sale } from '@/admin/transactions/sales/entities/sale.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class SaleDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  productName: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column({ type: 'integer', nullable: true })
  productId: number | null;

  @ManyToOne(() => Product, (product) => product.purchaseDetails, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  product?: Product | null;

  @Column({ type: 'integer' })
  saleId: number;

  @ManyToOne(() => Sale, (sale) => sale.saleDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @CreateDateColumn()
  createdAt: Date;
}
