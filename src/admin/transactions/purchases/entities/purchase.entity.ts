import { PurchaseDetail } from '@/admin/transactions/purchase-details/entities/purchase-detail.entity';
import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  documentType: 'Factura' | 'Boleta';

  @Column({ type: 'varchar' })
  documentNumber: string;

  @Column({ type: 'varchar' })
  supplierName: string;

  @Column({ type: 'varchar' })
  supplierDocumentNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.purchase)
  purchaseDetails: PurchaseDetail[];

  @Column({ type: 'integer', nullable: true })
  supplierId: number | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchases, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'supplierId' })
  supplier?: Supplier | null;

  @CreateDateColumn()
  createdAt: Date;
}
