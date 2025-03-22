import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, Relation, OneToMany } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Role } from '../../roles/entities/role.entity';
import { AuthProvider } from '../../auth-providers/entities/auth-provider.entity';
import { EmailVerification } from '../../email-verification/entities/email-verification.entity';
import { PasswordResetToken } from '../../password-reset-tokens/entities/password-reset-token.entity';
import { Document } from '../../../../documents/entities/document.entity';

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

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Relation<Profile>;

  @OneToMany(() => EmailVerification, (emailVerification) => emailVerification.user, {
    cascade: true,
  })
  emailVerifications: Relation<EmailVerification[]>;

  @OneToMany(() => PasswordResetToken, (passwordResetToken) => passwordResetToken.user, {
    cascade: true,
  })
  passwordResetTokens: Relation<PasswordResetToken[]>;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Relation<Role[]>;

  @OneToMany(() => AuthProvider, (authProvider) => authProvider.user, {
    cascade: true,
  })
  authProviders: Relation<AuthProvider[]>;

  @OneToMany(() => Document, (document) => document.user)
  documents: Relation<Document[]>;
}
