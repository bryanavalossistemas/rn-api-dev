import { User } from '@/auth/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class AuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  provider: 'local' | 'google';

  @Column({ type: 'varchar', unique: true })
  providerId: string;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, (user) => user.authProviders)
  @JoinColumn({ name: 'userId' })
  user: User;
}
