import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateRoleDto } from './dto/update-menu.dto';
import { Menus } from './menus.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menus)
    private menuRepository: Repository<Menus>,
  ) {}

  async craete(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  findAll() {
    return this.menuRepository.find();
  }

  findOne(id: number) {
    return this.menuRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateMenuDto: UpdateRoleDto) {
    const menu = await this.findOne(id);
    const newMenu = this.menuRepository.merge(menu, updateMenuDto);
    return this.menuRepository.save(newMenu);
  }

  remove(id: number) {
    return this.menuRepository.delete(id);
  }
}
