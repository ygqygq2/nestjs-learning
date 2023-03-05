import { readFileSync } from 'fs';

import { join } from 'path';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DataSource } from 'typeorm';

import datasource from '../ormconfig';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup';

export class AppFactory {
  connection: DataSource;

  constructor(private app: INestApplication) {}

  get instance() {
    return this.app;
  }

  // 初始化 App 实例
  static async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication();
    setupApp(app);
    const port = 3000;
    await app.listen(port);
    await app.init();
    return new AppFactory(app);
  }

  // 初始化 DB 数据库
  async initDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;

    // 导入初始化数据
    const queryRunner = this.connection.createQueryRunner();
    const sql =
      readFileSync(join(__dirname, '../src/migrations/init.sql'))
        .toString()
        .replace(/\r?\n|\r/g, '')
        ?.split(';') || [];
    for (let i = 0; i < sql.length; i++) {
      await queryRunner.query(sql[i]);
    }
  }

  // 清除数据库数据，避免测试数据污染
  async cleanup() {
    const entities = this.connection.entityMetadatas;

    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  }

  // 断开与数据库的连接，避免后序数据库连接过多而无法连接
  async destory() {
    await this.connection?.destroy();
  }
}
