import { IsString, IsOptional, IsBoolean } from 'class-validator';
export class ProgramDTO {
  @IsString({ message: 'Invalid name format, need string' })
  name: string;

  @IsOptional()
  @IsBoolean({ message: 'Invalid isActive format, need boolean' })
  isActive?: boolean;
}
