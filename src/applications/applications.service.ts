import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database, Application, ApplicationStatus, ApplicationOneResp } from '../database/types';
import { DATABASE_CONNECTION } from '../database/database.module';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Kysely<Database>,
  ) {}

  async findAll(): Promise<Application[]> {
    try {
      return await this.db.selectFrom('applications').selectAll().execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find all applications: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async findByStatusOrPagination({
    status,
    page,
    limit,
    programId,
  }: {
    status?: ApplicationStatus;
    programId?: string;
    page: number;
    limit: number;
  }): Promise<{
    items: Application[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const offset = (page - 1) * limit;

      let itemsQuery = this.db
        .selectFrom('applications')
        .selectAll()
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset);

      if (status) {
        itemsQuery = itemsQuery.where('status', '=', status);
      }

      if (programId) {
        itemsQuery = itemsQuery.where('programId', '=', programId);
      }

      let countQuery = this.db
        .selectFrom('applications')
        .select(({ fn }) => fn.countAll<number>().as('count'));

      if (status) {
        countQuery = countQuery.where('status', '=', status);
      }

      if (programId) {
        countQuery = countQuery.where('programId', '=', programId);
      }

      const [items, totalResult] = await Promise.all([
        itemsQuery.execute(),
        countQuery.executeTakeFirst(),
      ]);

      const total = Number(totalResult?.count ?? 0);

      return {
        items,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find applications: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async findByUUID(uuid: string, withProgram = false): Promise<ApplicationOneResp | undefined> {
    try {
      let query = this.db
        .selectFrom('applications')
        .select([
          'applications.uuid',
          'applications.founderName',
          'applications.email',
          'applications.status',
          'applications.programId',
          'applications.startupName',
          'applications.createdAt',
        ])
        .where('applications.uuid', '=', uuid);

      if (withProgram) {
        query = query
          .innerJoin('programs', 'programs.id', 'applications.programId')
          .select('programs.name as programName');
      }

      return await query.executeTakeFirst();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find application by uuid: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  // async create(data: {
  //   founderName: string;
  //   email: string;
  //   startupName: string;
  // }): Promise<Application> {
  //   try {
  //     const uuid = randomUUID();

  //     await this.db
  //       .insertInto('applications')
  //       .values({
  //         uuid,
  //         founderName: data.founderName,
  //         email: data.email,
  //         startupName: data.startupName,
  //         status: ApplicationStatus.NEW,
  //       })
  //       .execute();

  //     const createResault = await this.findByUUID(uuid);
  //     if (!createResault) {
  //       throw new InternalServerErrorException('Failed to create applications: ');
  //     }

  //     return createResault;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Failed to create applications: ' + (error instanceof Error ? error.message : ''),
  //     );
  //   }
  // }

  async updateStatus(uuid: string, status: ApplicationStatus): Promise<Application> {
    try {
      await this.db
        .updateTable('applications')
        .set({ status })
        .where('uuid', '=', uuid)
        .executeTakeFirstOrThrow();

      const createResault = await this.findByUUID(uuid);
      if (!createResault) {
        throw new InternalServerErrorException('Failed to update status applications: ');
      }

      return createResault;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update status applications: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      await this.db.deleteFrom('applications').where('uuid', '=', uuid).execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete status applications: ' + (error instanceof Error ? error.message : ''),
      );
    }
  }
}
