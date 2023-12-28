import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
} from "class-validator";

export class HandleGoalRequest {
  @IsDefined()
  @IsString()
  name!: string;

  @IsDefined()
  @IsString()
  dueOnDate!: string;

  @IsOptional()
  @IsString()
  keyPoint1!: string;
  
  @IsOptional()
  @IsString()
  keyPoint2!: string;

  @IsOptional()
  @IsString()
  keyPoint3!: string;

  @IsDefined()
  @IsBoolean()
  notificationsReminder!: boolean;

  @IsOptional()
  @IsString()
  reminderFrequency!: number;

  constructor(request) {
    this.name = request?.body?.name;
    this.keyPoint1 = request?.body?.keyPoint1;
    this.keyPoint2 = request?.body?.keyPoint2;
    this.keyPoint3 = request?.body?.keyPoint3;
    this.dueOnDate = request?.body?.dueOnDate;
    this.notificationsReminder = request?.body?.notificationsReminder;
    this.reminderFrequency = request?.body?.reminderFrequency;
  }
}

export class ShowGoalRequest {
  @IsDefined()
  @IsString()
  goalId!: string;

  constructor(request) {
    this.goalId = request?.body?.goalId;
  }
}

export class UpdateGoalRequest {
  @IsDefined()
  @IsString()
  goalId!: string;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  dueOnDate!: string;

  @IsOptional()
  @IsBoolean()
  notificationsReminder!: boolean;

  @IsOptional()
  @IsString()
  reminderFrequency!: number;

  @IsOptional()
  @IsString()
  keyPoint1!: string;
  
  @IsOptional()
  @IsString()
  keyPoint2!: string;

  @IsOptional()
  @IsString()
  keyPoint3!: string;

  constructor(request) {
    this.name = request?.body?.name;
    this.goalId = request?.body?.goalId;
    this.keyPoint1 = request?.body?.keyPoint1;
    this.keyPoint2 = request?.body?.keyPoint2;
    this.keyPoint3 = request?.body?.keyPoint3;
    this.dueOnDate = request?.body?.dueOnDate;
    this.notificationsReminder = request?.body?.notificationsReminder;
    this.reminderFrequency = request?.body?.reminderFrequency;
  }
}

export class IndexGoalRequest {}

export class DestroyGoalRequest {}
