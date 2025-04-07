import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { InventoryMovement } from '@/admin/inventory/inventory-movements/entities/inventory-movement.entity';
import { MeasurementUnit } from '@/admin/inventory/measurement-units/entities/measurement-unit.entity';
import { ProductImage } from '@/admin/inventory/product-images/entities/product-image.entity';
import { VoucherDetail } from '@/admin/transactions/voucher-details/entities/voucher-detail.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  barCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  sku: string | null;

  @Column({ type: 'integer', nullable: true })
  ecommercePercentageDiscount: number | null;

  @Column({ type: 'boolean', default: true })
  showInEcommerce: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ecommerceSalePrice: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  measurementQuantity: number | null;

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

  @Column({ type: 'integer', nullable: true })
  measurementUnitId: number | null;

  @ManyToOne(() => MeasurementUnit, (measurementUnit) => measurementUnit.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'measurementUnitId' })
  measurementUnit?: MeasurementUnit | null;

  @OneToMany(() => VoucherDetail, (voucherDetail) => voucherDetail.product)
  voucherDetails: VoucherDetail[];

  @OneToMany(() => InventoryMovement, (inventoryMovement) => inventoryMovement.product)
  inventoryMovements: InventoryMovement[];

  @CreateDateColumn()
  createdAt: Date;
}
