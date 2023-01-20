import { Expose } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
