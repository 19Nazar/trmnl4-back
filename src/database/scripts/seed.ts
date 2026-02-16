import { createDatabaseForScripts } from '../database';
import 'dotenv/config';
import { Application, ApplicationStatus, Program } from '../types';
import { randomUUID } from 'crypto';
import { getRandomNumbers } from '../../utils/utils';

async function seed() {
  const db = await createDatabaseForScripts();

  try {
    console.log('Seeding database...');

    console.log('Adding programs...');
    const programsData: Program[] = [
      { name: 'Startup Accelerator 2025', isActive: true },
      { name: 'Tech Incubator Program', isActive: true },
      { name: 'AI Innovation Grant', isActive: false },
    ];
    await db.insertInto('programs').values(programsData).execute();

    console.log('Adding applications...');
    const min = 1;
    const max = programsData.length;
    const applicationsData: Application[] = [
      {
        founderName: 'John Smith',
        email: 'john.smith@example.com',
        startupName: 'TechVision AI',
        status: ApplicationStatus.NEW,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        startupName: 'HealthTech Solutions',
        status: ApplicationStatus.REVIEWED,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Li Wei',
        email: 'li.wei@example.com',
        startupName: 'GreenEnergy Innovations',
        status: ApplicationStatus.ACCEPTED,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        startupName: 'FinanceHub Pro',
        status: ApplicationStatus.NEW,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        startupName: 'EduLearn Platform',
        status: ApplicationStatus.REJECTED,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Anna Kowalski',
        email: 'anna.kowalski@example.com',
        startupName: 'SmartCity Solutions',
        status: ApplicationStatus.REVIEWED,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Carlos Rodriguez',
        email: 'carlos.rodriguez@example.com',
        startupName: 'FoodTech Delivery',
        status: ApplicationStatus.NEW,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Yuki Tanaka',
        email: 'yuki.tanaka@example.com',
        startupName: 'RoboAssist Inc',
        status: ApplicationStatus.ACCEPTED,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Emma Brown',
        email: 'emma.brown@example.com',
        startupName: 'CloudSync Services',
        status: ApplicationStatus.REVIEWED,
        programId: getRandomNumbers(min, max).toString(),
      },
      {
        founderName: 'Pavel Ivanov',
        email: 'pavel.ivanov@example.com',
        startupName: 'CyberGuard Security',
        status: ApplicationStatus.NEW,
        programId: getRandomNumbers(min, max).toString(),
      },
    ];
    for (const app of applicationsData) {
      await db
        .insertInto('applications')
        .values([{ ...app, uuid: randomUUID() }])
        .execute();
    }

    console.log('✅Seed completed');
  } catch (error) {
    console.error('❌Seed failed: ', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
