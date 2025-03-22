import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { Product } from '../../products/entities/product.entity';
import { InventoryMovement } from '../../inventory-movements/entities/inventory-movement.entity';

@Entity()
export class DocumentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Document, (document) => document.documentDetails)
  document: Relation<Document>;

  @Column({ type: 'integer' })
  quantity: number;

  @Column()
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => Product, (product) => product.documentDetails, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  product: Relation<Product>;

  @OneToOne(() => InventoryMovement, (inventoryMovement) => inventoryMovement.documentDetail, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  inventoryMovement: Relation<InventoryMovement>;

  @CreateDateColumn()
  createdAt: Date;
}
