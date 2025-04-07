import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { Voucher } from '@/admin/transactions/vouchers/entities/voucher.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  supplierId: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchases)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column({ type: 'integer' })
  voucherId: number;

  @OneToOne(() => Voucher, (voucher) => voucher.purchase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @CreateDateColumn()
  createdAt: Date;
}
