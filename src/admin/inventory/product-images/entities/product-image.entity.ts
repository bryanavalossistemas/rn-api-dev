import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'integer' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
