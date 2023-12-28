import { IsDefined, IsString, IsArray, IsNotEmpty } from "class-validator";

export class StoreDebate {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsArray()
  @IsNotEmpty({each: true})
  invitedUsers: string[];

  constructor(request) {
    this.title = request.body.title;
    this.invitedUsers = request.body.invitedUsers;
  }
}

export class GetDebate {
  constructor(request) {}
}

export class UpdateDebate {
  @IsDefined()
  @IsString()
  debateId: string;

  constructor(request) {
    this.debateId = request.body.debateId;
  }
}
export class UpdateDebateUsers {
  @IsDefined()
  @IsString()
  debateId: string;

  constructor(request) {
    this.debateId = request.body.debateId;
  }
}

export class RemoveUserFromDebate {
  @IsDefined()
  @IsString()
  debateId: string;

  @IsDefined()
  @IsString()
  userToRemove: string;

  constructor(request) {
    this.debateId = request.body.debateId;
    this.userToRemove = request.body.userToRemove;
  }
}

export class UpdateBotMessage {
  @IsDefined()
  @IsString()
  debateId: string;

  @IsDefined()
  @IsString()
  messageId: string;

  @IsDefined()
  @IsString()
  responseTo: string;

  constructor(request) {
    this.debateId = request.body.debateId;
    this.messageId = request.body.messageId;
    this.responseTo = request.body.responseTo;
  }
}