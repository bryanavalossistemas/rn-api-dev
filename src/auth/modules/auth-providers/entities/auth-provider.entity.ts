import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class AuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  providerId: string;

  @ManyToOne(() => User, (user) => user.authProviders)
  user: Relation<User>;
}
