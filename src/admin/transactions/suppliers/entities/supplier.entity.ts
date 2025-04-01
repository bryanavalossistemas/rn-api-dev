import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  documentType: 'RUC' | 'DNI';

  @Column({ type: 'varchar', unique: true })
  documentNumber: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @OneToMany(() => Purchase, (purchase) => purchase.supplier)
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;
}
