import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.passwordResetTokens)
  user: Relation<User>;
}
