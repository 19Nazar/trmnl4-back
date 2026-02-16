import { IsString, IsEmail } from 'class-validator';
export class ApplicationsDTO {
  @IsString({ message: 'Invalid founderName format, need string' })
  founderName: string;

  @IsEmail({}, { message: 'Invalid name format, need string' })
  email: string;

  @IsString({ message: 'Invalid startupName format, need string' })
  startupName: string;
}
