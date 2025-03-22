import { Purchase } from '../../purchases/entities/purchase.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: 'RUC' | 'DNI';

  @Column({ unique: true })
  document: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Purchase, (purchase) => purchase.supplier)
  purchases: Relation<Purchase[]>;
}
