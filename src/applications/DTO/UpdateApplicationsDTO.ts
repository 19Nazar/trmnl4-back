import { IsEnum } from 'class-validator';
import { ApplicationStatus } from 'src/database/types';
export class UpdateApplicationsDTO {
  @IsEnum(ApplicationStatus, { message: 'Invalid status format' })
  status: ApplicationStatus;
}
