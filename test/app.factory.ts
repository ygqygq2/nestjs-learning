import { join } from 'path';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as lineReader from 'line-reader';
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
    let sql = '';
    lineReader.eachLine(join(__dirname, '../src/migrations/init.sql'), async (line: string) => {
      // 注释开头直接跳过
      if (line.indexOf('--') === 0) return;
      // 注释在行尾时，去掉注释
      if (line.indexOf('--') > 0) {
        sql += line.substring(0, line.indexOf('--'));
      } else {
        sql += line;
      }
      // 去掉空格
      sql = sql.trim();
      // 去掉空行
      if (sql.length === 0) return;
      // 去掉回车换行符
      sql = sql.replace(/\r?\n|\r/g, '');
      // 分号结尾时执行 SQL
      if (sql.endsWith(';')) {
        await queryRunner.query(sql);
        // 清空 sql 内容
        sql = '';
      }
      console.log(sql);
    });
  }

  // 清除数据库数据，避免测试数据污染
  async cleanup() {
    // console.log('Cleaning up database...');
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
