import { Kysely, sql } from 'kysely';
import { APPLICATION_STATUSES, ApplicationStatus, Database } from '../types';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('applications')
    .addColumn('uuid', 'varchar(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('founderName', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('startupName', 'varchar(255)', (col) => col.notNull())
    .addColumn('programId', 'integer', (col) =>
      col.notNull().references('programs.id').onDelete('cascade'),
    )
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
    )
    .addColumn('status', sql`enum(${sql.join(APPLICATION_STATUSES)})`, (col) =>
      col.notNull().defaultTo(ApplicationStatus.NEW),
    )
    .execute();

  await db.schema
    .createIndex('applications_email_index')
    .on('applications')
    .column('email')
    .execute();

  await db.schema
    .createIndex('applications_status_index')
    .on('applications')
    .column('status')
    .execute();

  await db.schema
    .createIndex('applications_program_id_index')
    .on('applications')
    .column('programId')
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('applications').execute();
}
