import { Document } from '../../documents/entities/document.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchases, { nullable: true, onDelete: 'SET NULL' })
  supplier: Relation<Supplier>;

  @Column()
  supplierName: string;

  @Column()
  supplierDocument: string;

  @OneToOne(() => Document, (document) => document.purchase)
  @JoinColumn()
  document: Relation<Document>;

  @CreateDateColumn()
  createdAt: Date;
}
