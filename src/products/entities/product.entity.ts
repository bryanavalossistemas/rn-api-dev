import { ProductImage } from '../../product-images/entities/product-image.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { InventoryMovement } from '../../inventory-movements/entities/inventory-movement.entity';
import { DocumentDetail } from '../../document-details/entities/document-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>;

  @Column({ nullable: true })
  brandId: number | null;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brandId' })
  brand: Relation<Brand>;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: Relation<ProductImage[]>;

  @OneToMany(() => InventoryMovement, (inventoryMovement) => inventoryMovement.product)
  inventoryMovements: Relation<InventoryMovement[]>;

  @OneToMany(() => DocumentDetail, (documentDetail) => documentDetail.product)
  documentDetails: Relation<DocumentDetail[]>;
}
