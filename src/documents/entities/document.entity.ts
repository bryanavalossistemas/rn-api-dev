import { User } from '../../auth/modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { DocumentType } from '../../document-types/entities/document-type.entity';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { InventoryMovement } from '../../inventory-movements/entities/inventory-movement.entity';
import { DocumentDetail } from '../../document-details/entities/document-detail.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentSerie: string;

  @Column()
  documentNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => DocumentType, (documentType) => documentType.documents)
  documentType: Relation<DocumentType>;

  @ManyToOne(() => User, (user) => user.documents)
  user: Relation<User>;

  @OneToOne(() => Purchase, (purchase) => purchase.document)
  purchase: Relation<Purchase>;

  @OneToMany(() => InventoryMovement, (inventoryMovement) => inventoryMovement.document)
  inventoryMovements: Relation<InventoryMovement[]>;

  @OneToMany(() => DocumentDetail, (documentDetail) => documentDetail.document)
  documentDetails: Relation<DocumentDetail[]>;
}
