import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProgramsModule } from './programs/programs.module';
import { ApplicationsModule } from './applications/applications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным везде
      envFilePath: '.env', // Путь к .env файлу
    }),
    DatabaseModule,
    ProgramsModule,
    ApplicationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
