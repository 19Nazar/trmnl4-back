import { Kysely, MysqlDialect, sql } from 'kysely';
import { Database } from './types';
import { createPool } from 'mysql2';
import { ConfigService } from '@nestjs/config';

// ✅ Версия для NestJS (с ConfigService)
export const createDatabase = async (configService: ConfigService): Promise<Kysely<Database>> => {
  const pool = createPool({
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 3306),
    user: configService.get<string>('DATABASE_USER', 'root'),
    password: configService.get<string>('DATABASE_PASSWORD', ''),
    database: configService.get<string>('DATABASE_NAME', 'trmnl4'),
    connectionLimit: 10,
  });

  const dialect = new MysqlDialect({ pool });
  const db = new Kysely<Database>({ dialect });

  try {
    await sql`SELECT 1 as ping`.execute(db);
    console.log('✅ Database connection established');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    await db.destroy();
    throw err;
  }

  return db;
};

export const createDatabaseForScripts = async (): Promise<Kysely<Database>> => {
  const pool = createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'trmnl4',
    connectionLimit: 10,
  });

  const dialect = new MysqlDialect({ pool });
  const db = new Kysely<Database>({ dialect });

  try {
    await sql`SELECT 1 as ping`.execute(db);
    console.log('✅ Database connection established');
    console.log(`📊 Database: ${process.env.DATABASE_NAME}@${process.env.DATABASE_HOST}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    await db.destroy();
    throw err;
  }

  return db;
};
