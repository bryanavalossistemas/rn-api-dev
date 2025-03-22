import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string | undefined;

  @Column({ type: 'varchar', nullable: true })
  picture: string | undefined;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: Relation<User>;
}
