import { Product } from '@/admin/inventory/products/entities/product.entity';
import { VoucherDetail } from '@/admin/transactions/voucher-details/entities/voucher-detail.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'varchar' })
  movementType: 'IN' | 'OUT';

  @Column({ type: 'integer' })
  productId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitCost: number;

  @ManyToOne(() => Product, (product) => product.inventoryMovements)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'integer' })
  voucherDetailId: number;

  @OneToOne(() => VoucherDetail, (voucherDetail) => voucherDetail.inventoryMovement, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voucherDetailId' })
  voucherDetail: VoucherDetail;

  @CreateDateColumn()
  createdAt: Date;
}
