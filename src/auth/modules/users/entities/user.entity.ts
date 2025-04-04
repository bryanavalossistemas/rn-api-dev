import { AuthProvider } from '@/auth/modules/auth-providers/entities/auth-provider.entity';
import { EmailVerification } from '@/auth/modules/email-verification/entities/email-verification.entity';
import { PasswordResetToken } from '@/auth/modules/password-reset-tokens/entities/password-reset-token.entity';
import { Profile } from '@/auth/modules/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar' })
  role: 'admin' | 'employee' | 'user';

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => EmailVerification, (emailVerification) => emailVerification.user)
  emailVerifications: EmailVerification[];

  @OneToMany(() => PasswordResetToken, (passwordResetToken) => passwordResetToken.user)
  passwordResetTokens: PasswordResetToken[];

  @OneToMany(() => AuthProvider, (authProvider) => authProvider.user)
  authProviders: AuthProvider[];
}
