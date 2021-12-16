import { Column, Entity, OneToMany } from 'typeorm';

import { RolesConstants } from '../utils/constants';
import BaseModel from './BaseModel';
import User from './User';

@Entity('roles')
class Role extends BaseModel {
  @Column({ type: 'enum', enum: RolesConstants, unique: true })
  name: RolesConstants;

  @OneToMany(() => User, user => user.role)
  users: User[];
}

export default Role;
