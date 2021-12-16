import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToOne,
} from 'typeorm';

import { passwordsHelper } from '../helpers';
import BaseModel from './BaseModel';
import Role from './Role';

@Entity('users')
class User extends BaseModel {
  @Index()
  @Column({ nullable: true })
  name?: string;

  @Index()
  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ length: 100, select: false, nullable: true })
  password?: string;

  @Column({ length: 100, select: false, nullable: true })
  temporaryPassword?: string;

  @Index()
  @Column({ unique: true, nullable: true })
  facebookId?: string;

  @Column({ type: 'text', nullable: true })
  facebookImage?: string;

  @Index()
  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ type: 'text', nullable: true })
  googleImage?: string;

  @Index()
  @Column({ unique: true, nullable: true })
  appleId?: string;

  @ManyToOne(() => Role, role => role.users, { nullable: false })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashUserPassword(): Promise<void> {
    if (this.password) {
      this.password = await passwordsHelper.generateHash(this.password);
    }

    if (this.temporaryPassword) {
      this.temporaryPassword = await passwordsHelper.generateHash(
        this.temporaryPassword
      );
    }
  }
}

export default User;
