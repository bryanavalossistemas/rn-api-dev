import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;
}
