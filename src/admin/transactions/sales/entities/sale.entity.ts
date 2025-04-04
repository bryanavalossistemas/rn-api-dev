import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { SaleDetail } from '@/admin/transactions/sale-details/entities/sale-detail.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  documentType: 'Factura' | 'Boleta';

  @Column({ type: 'varchar' })
  documentNumber: string;

  @Column({ type: 'varchar' })
  customerName: string;

  @Column({ type: 'varchar' })
  customerDocumentNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'integer', nullable: true })
  customerId: number | null;

  @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer?: Customer | null;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
  saleDetails: SaleDetail[];

  @CreateDateColumn()
  createdAt: Date;
}
