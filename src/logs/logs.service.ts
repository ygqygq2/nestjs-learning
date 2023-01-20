import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Logs } from '@/logs/logs.entity';

@Injectable()
export class LogsService {
  constructor(@InjectRepository(Logs) private readonly logsRepository: Repository<Logs>) {}

  findAll() {
    return this.logsRepository.find();
  }

  findOne(id: number) {
    return this.logsRepository.findOne({ where: { id } });
  }
}
