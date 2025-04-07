import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { Sale } from '@/admin/transactions/sales/entities/sale.entity';
import { VoucherDetail } from '@/admin/transactions/voucher-details/entities/voucher-detail.entity';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  serie: string;

  @Column({ type: 'varchar' })
  number: string;

  @Column({ type: 'varchar' })
  type: 'Compra' | 'Venta';

  @Column({ type: 'varchar' })
  documentType: 'Factura' | 'Boleta';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => VoucherDetail, (voucherDetail) => voucherDetail.voucher)
  voucherDetails: VoucherDetail[];

  @OneToOne(() => Purchase, (purchase) => purchase.voucher)
  purchase: Purchase;

  @OneToOne(() => Sale, (sale) => sale.voucher)
  sale: Sale;

  @CreateDateColumn()
  createdAt: Date;
}
