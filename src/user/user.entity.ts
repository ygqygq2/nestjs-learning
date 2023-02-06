import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Logs } from '@/logs/logs.entity';
import { Roles } from '@/roles/roles.entity';

import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'user_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @AfterInsert()
  afterInsert() {
    console.log('afterInsert', this.id, this.username);
  }

  @AfterRemove()
  afterRemove() {
    console.log('afterRemove', this.id, this.username);
  }
}
