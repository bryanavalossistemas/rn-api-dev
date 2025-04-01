import { User } from '@/auth/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, (user) => user.emailVerifications)
  @JoinColumn({ name: 'userId' })
  user: User;
}
