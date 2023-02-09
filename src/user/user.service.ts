import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { conditionUtils } from 'src/utils/db.helper';
import { In, Repository } from 'typeorm';

import { Logs } from '@/logs/logs.entity';

import { Roles } from '@/roles/roles.entity';

import { GetUserDto } from './dto/get-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  findAll(query: GetUserDto) {
    const { limit, page, username, role, gender } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    // SELECT* from user u, profile p, role r WHERE u.id= p.uid AND u.id= r.uid AND...
    // SELECT* FROM user u LEFT JOIN profile p ON u.id= p.uid LEFT JOIN role r ON u.id= r.uid WHERE...
    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip,
    // });
    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    const newQuery = conditionUtils<User>(queryBuilder, obj);
    return newQuery.take(take).skip(skip).getMany();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({ where: { id: 2 } });
      user.roles = [role];
    }
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      // 查询所有的用户角色
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = this.userRepository.create(user);
    const res = await this.userRepository.save(userTmp);
    return res;
  }

  async update(id: any, user: Partial<User>) {
    const userTemp = await this.findProfile(parseInt(id, 10));
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新，需要使用 save 方法或者 queryBuilder
    return this.userRepository.save(newUser);

    // 下面的 update 方法，只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(parseInt(id), newUser);
  }

  async remove(id: number) {
    // return this.userRepository.delete(id);
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { profile: true },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user: user.logs,
      },
      // relations: {
      //   user: true,
      // },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) AS count FROM logs, user WHERE logs.user_id= logs.userId AND user.id= 2 GROUP BY logs.result;
    // return this.logsRepository.query("select* from logs")
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id= :id', { id })
      .groupBy('logs.result')
      .orderBy('count', 'DESC')
      .addOrderBy('result', 'DESC')
      .offset(2)
      .limit(3)
      .getRawMany();
  }
}
