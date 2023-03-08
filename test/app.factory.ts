import { join } from 'path';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import lineReader from 'line-reader';
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

  // 初始化数据库连接
  async connectDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;
  }

  // 初始化 DB 数据库, 导入基础数据
  async initDB() {
    // 定义 sql 执行 runner
    const queryRunner = this.connection.createQueryRunner();
    // take a connection from the connection pool
    await queryRunner.connect();
    let sql = '';
    const eachLine = (filename: string, options?: any, iteratee?: any) => {
      return new Promise<void>((resolve, reject) => {
        lineReader.eachLine(filename, options, iteratee, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    eachLine(join(__dirname, '../src/migrations/init.sql'), async (line: string) => {
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
      // sql= sql.replace(/\r?\n|\r/g, '');
      // 分号结尾时执行 SQL
      if (sql.endsWith(';')) {
        // 清空 sql 内容
        const runSql = sql.replace(';', '');
        sql = '';
        await queryRunner.query(runSql).catch((err) => {
          throw new Error(`[${runSql}] run error`, err);
        });
      }
    })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
    await queryRunner.release();
  }

  // 清除数据库数据，避免测试数据污染
  async cleanup() {
    // 清空所有表数据
    const entities = this.connection?.entityMetadatas || [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    for (const entity of entities) {
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS= 0;DELETE FROM ${entity.name};`).catch((err) => {
        throw new Error(`[DELETE FROM ${entity.name}] run error`, err);
      });
      // await this.connection
      //   .createQueryBuilder()
      //   .delete()
      //   .from(entity.name)
      //   .execute()
      //   .catch((err) => {
      //     throw new Error(`[DELETE FROM ${entity.name}] run error`, err);
      //   });
    }
    await queryRunner.release();
  }

  // 断开与数据库的连接，避免后序数据库连接过多而无法连接
  async destroy() {
    if (this.connection) {
      await this.connection?.destroy();
    }
  }
}
