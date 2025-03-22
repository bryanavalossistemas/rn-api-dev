import { Document } from '../../documents/entities/document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class DocumentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  isLegal: boolean;

  @OneToMany(() => Document, (document) => document.documentType)
  documents: Relation<Document[]>;
}
