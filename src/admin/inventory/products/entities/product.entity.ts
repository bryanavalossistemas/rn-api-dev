import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { InventoryMovement } from '@/admin/inventory/inventory-movements/entities/inventory-movement.entity';
import { ProductImage } from '@/admin/inventory/product-images/entities/product-image.entity';
import { PurchaseDetail } from '@/admin/transactions/purchase-details/entities/purchase-detail.entity';
import { SaleDetail } from '@/admin/transactions/sale-details/entities/sale-detail.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'integer', nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: Category | null;

  @Column({ type: 'integer', nullable: true })
  brandId: number | null;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'brandId' })
  brand?: Brand | null;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => InventoryMovement, (inventoryMovement) => inventoryMovement.product)
  inventoryMovements: InventoryMovement[];

  @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.product)
  purchaseDetails: PurchaseDetail[];

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.product)
  saleDetails: SaleDetail[];

  @CreateDateColumn()
  createdAt: Date;
}
