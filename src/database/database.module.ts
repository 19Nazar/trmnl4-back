import { Module, Global } from '@nestjs/common';
import { Kysely } from 'kysely';
import { createDatabase } from './database';
import { Database } from './types';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService): Promise<Kysely<Database>> => {
        // ✅ Передаём configService в createDatabase
        return await createDatabase(configService);
      },
      inject: [ConfigService], // ✅ КРИТИЧНО! Инжектим ConfigService
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
