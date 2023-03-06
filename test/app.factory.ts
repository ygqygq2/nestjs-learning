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
    // console.log(datasource.isInitialized);
    if (!datasource.isInitialized) {
      await datasource.initialize();
      // console.log(datasource.isInitialized);
    }
    this.connection = datasource;

    // 定义 sql 执行 runner
    const queryRunner = this.connection.createQueryRunner();
    // 读取 sql 文件
    const sqlFile = readFileSync(join(__dirname, '../src/migrations/init.sql'), 'utf8');
    // 执行 sql 文件，为了一行一行执行，使用; 分割
    const sqls = sqlFile.split(';');
    // 循环导入初始化数据
    for (let sql of sqls) {
      // 删除回车换行符
      sql = sql.replace(/\r?\n/g, '');
      // 删除注释
      sql = sql.replace(/--.*$/, '').trim();
      if (sql.length > 0) {
        await queryRunner.query(sql);
      }
    }
  }

  // 清除数据库数据，避免测试数据污染
  async cleanup() {
    console.log('Cleaning up database...');
    // console.log(this.connection);
    const entities = this.connection?.entityMetadatas || [];

    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository?.query(`DELETE FROM ${entity.tableName};`);
    }
  }

  // 断开与数据库的连接，避免后序数据库连接过多而无法连接
  async destroy() {
    if (this.connection) {
      await this.connection?.destroy();
    }
  }
}
