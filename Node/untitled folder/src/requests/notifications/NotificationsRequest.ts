import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
} from "class-validator";

export class GetNotifications {
  constructor(request) {}
}

export class UpdateNotificationsList {
  constructor(request) {}
}

export class StoreNotification {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  message: string;

  @IsDefined()
  @IsString()
  from: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  receivers: string[];

  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsString({ each: true })
  readBy: string[];

  constructor(request) {
    this.message = request.body.message;
    this.from = request.body.from;
    this.receivers = request.body.receivers;
    this.readBy = request.body.readBy;
  }
}
