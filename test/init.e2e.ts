import { readFileSync } from 'fs';
import path from 'path';

import { DataSource } from 'typeorm';

import datasource from '../ormconfig';

/**
 * 用于 beforeAll 执行
 */
export class InitE2E {
  connection: DataSource;

  // 初始化 DB 数据库, 导入基础数据
  async initDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;

    // 定义 sql 执行 runner
    const queryRunner = this.connection.createQueryRunner();
    // take a connection from the connection pool
    await queryRunner.connect();

    const readSqlFile = (filepath: string): string[] => {
      return (
        readFileSync(path.join(__dirname, filepath))
          .toString()
          // 删除 sql 中的注释
          .replace(/--.*$/gm, '')
          // 删除回车换行
          .replace(/\r?\n|\r/g, '')
          .split(';')
          .filter((query: string | any[]) => query?.length)
      );
    };

    const sqls = readSqlFile('../src/migrations/init.sql');
    for (let i = 0; i < sqls.length; i++) {
      await queryRunner.query(sqls[i]);
    }
    // very important - don't forget to release query runner once you finished working with it
    await queryRunner.release();
    await this.connection?.destroy();
  }
}
