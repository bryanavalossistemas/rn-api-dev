import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { Voucher } from '@/admin/transactions/vouchers/entities/voucher.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'integer' })
  voucherId: number;

  @OneToOne(() => Voucher, (voucher) => voucher.sale, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @CreateDateColumn()
  createdAt: Date;
}
