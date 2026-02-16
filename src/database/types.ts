export interface Program {
  id?: number;
  name: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ApplicationStatus = {
  NEW: 'new',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const APPLICATION_STATUSES = Object.values(ApplicationStatus);

export interface Application {
  uuid?: string;
  founderName: string;
  email: string;
  startupName: string;
  programId: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: ApplicationStatus;
}

export interface ApplicationOneResp extends Application {
  programName?: string;
}

export interface Database {
  programs: Program;
  applications: Application;
  migrations: Migration;
}

export interface Migration {
  id?: number;
  name: string;
  executed_at?: Date;
}
