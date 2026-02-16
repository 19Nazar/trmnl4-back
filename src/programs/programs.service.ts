import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database, Program } from '../database/types';
import { DATABASE_CONNECTION } from '../database/database.module';

@Injectable()
export class ProgramsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Kysely<Database>,
  ) {}

  async findAll(): Promise<Program[]> {
    try {
      return await this.db.selectFrom('programs').selectAll().execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all program: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async findActive(): Promise<Program[]> {
    try {
      return await this.db
        .selectFrom('programs')
        .selectAll()
        .where('isActive', '=', true)
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find active program: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async findById(id: number): Promise<Program | undefined> {
    try {
      return await this.db
        .selectFrom('programs')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find by Id program: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async create(data: { name: string; isActive?: boolean }): Promise<Program> {
    try {
      const result = await this.db
        .insertInto('programs')
        .values({
          name: data.name,
          isActive: data.isActive ?? true,
        })
        .executeTakeFirstOrThrow();

      const createResault = await this.findById(Number(result.insertId));
      if (!createResault) {
        throw new InternalServerErrorException('Failed to create program: ');
      }

      return createResault;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create program: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async update(id: number, data: { name?: string; isActive?: boolean }): Promise<Program> {
    try {
      await this.db
        .updateTable('programs')
        .set(data)
        .where('id', '=', id)
        .executeTakeFirstOrThrow();

      const updateResault = await this.findById(id);
      if (!updateResault) {
        throw new InternalServerErrorException('Failed to update program: ');
      }

      return updateResault;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update program: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.db.deleteFrom('programs').where('id', '=', id).execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete program: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }
}
