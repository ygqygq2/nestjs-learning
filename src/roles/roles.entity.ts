import { Expose } from 'class-transformer';

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Menus } from '../menus/menus.entity';
import { User } from '../user/user.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @Expose()
  users: User[];

  @ManyToMany(() => Menus, (menus) => menus.role)
  menus: Menus[];
}
