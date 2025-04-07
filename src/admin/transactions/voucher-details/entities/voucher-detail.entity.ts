import { InventoryMovement } from '@/admin/inventory/inventory-movements/entities/inventory-movement.entity';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Voucher } from '@/admin/transactions/vouchers/entities/voucher.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VoucherDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'integer' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.voucherDetails)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'integer' })
  voucherId: number;

  @ManyToOne(() => Voucher, (voucher) => voucher.voucherDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @OneToOne(() => InventoryMovement, (inventoryMovement) => inventoryMovement.voucherDetail)
  inventoryMovement: InventoryMovement;
}
