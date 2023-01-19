import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Logs } from '@/logs/logs.entity';

@Injectable()
export class LogsService {
  constructor(
    // @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll() {
    return this.logsRepository.find();
  }

  findOne(id: number) {
    return this.logsRepository.findOne({ where: { id } });
  }

  async create(logs: Logs) {
    const logTmp = this.logsRepository.create(logs);
    return this.logsRepository.save(logTmp);
  }

  // async findUserLogs(id: number) {
  //   const user = await this.userRepository.findOne(id);
  //   return this.logsRepository.find({
  //     where: {
  //       user,
  //     },
  //     relations: {
  //       user: true,
  //     },
  //   });
  // }

  findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) AS count FROM logs, user WHERE logs.user_id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // return this.logsRepository.query("select * from logs")
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('count', 'DESC')
      .addOrderBy('result', 'DESC')
      .offset(2)
      .limit(3)
      .getRawMany();
  }
}
