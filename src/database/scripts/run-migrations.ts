import 'dotenv/config';
import * as path from 'path';
import * as fs from 'fs';
import { Kysely, sql } from 'kysely';
import { createDatabaseForScripts } from '../database';
import { Database } from '../types';

interface Migration {
  name: string;
  up: (db: Kysely<Database>) => Promise<void>;
  down: (db: Kysely<Database>) => Promise<void>;
}

async function runMigrations() {
  console.log('Starting migrations...');
  console.log({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
  });

  const db = await createDatabaseForScripts();

  try {
    await db.schema
      .createTable('migrations')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
      .addColumn(
        'executed_at',
        'timestamp',
        (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`), // sql, не sq!
      )
      .execute();

    const executedMigrations = await db.selectFrom('migrations').select('name').execute();
    const executedNames = new Set(executedMigrations.map((m) => m.name));

    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log('Found migration files:', files);

    for (const file of files) {
      if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

      const migrationName = file.replace(/\.(ts|js)$/, '');

      if (executedNames.has(migrationName)) {
        console.log(`Skipping ${migrationName} (already executed)`);
        continue;
      }

      const migrationPath = path.join(migrationsDir, file);
      const migration: Migration = await import(migrationPath);

      console.log(`Running ${migrationName}...`);
      await migration.up(db);
      await db.insertInto('migrations').values({ name: migrationName }).execute();
      console.log(`${migrationName} executed successfully`);
    }

    console.log('\nAll migrations completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
