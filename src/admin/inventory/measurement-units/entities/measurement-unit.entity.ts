import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MeasurementUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  prefix: string;

  @OneToMany(() => Product, (product) => product.measurementUnit)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;
}
