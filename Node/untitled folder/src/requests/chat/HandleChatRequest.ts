import { IsDefined, IsObject, IsOptional, IsString } from "class-validator";

export class HandleChatRequest {
  @IsDefined()
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  chatId!: string;

  @IsOptional()
  @IsString()
  chatListId!: string;

  constructor(request) {
    this.message = request?.body?.message;
    this.chatId = request?.body?.chatId;
    this.chatListId = request?.body?.chatListId;

  }
}

export class HandleGetChatRequest {
  @IsDefined()
  @IsString()
  chatId!: string;

  constructor(request) {
    this.chatId = request?.body?.chatId;
  }
}

export class GetChatListRequest {
  @IsDefined()
  @IsString()
  chatListId!: string;

  constructor(request) {
    this.chatListId = request?.body?.chatListId;
  }
}

export class AddToNotebookRequest {
  @IsOptional()
  @IsString()
  chatId!: string;

  @IsOptional()
  @IsString()
  debateId!: string;

  @IsOptional()
  @IsString()
  message!: string;

  @IsDefined()
  @IsString()
  response!: string;

  @IsOptional()
  @IsString()
  messageId!: string;

  constructor(request) {
    this.chatId = request?.body?.chatId;
    this.debateId = request?.body?.debateId;
    this.message = request?.body?.message;
    this.response = request?.body?.response;
    this.messageId = request?.body?.messageId;

  }
}

export class UpdateNotebookRequest {
  @IsDefined()
  @IsString()
  notebookId!: string;

  @IsDefined()
  @IsString()
  response!: string;

  constructor(request) {

    this.notebookId = request?.body?.notebookId;
    this.response = request?.body?.response;

  }
}


export class UpdateChatMessageRequest {
  @IsDefined()
  @IsString()
  messageId!: string;

  @IsDefined()
  @IsString()
  message!: string;

  @IsDefined()
  @IsString()
  chatId!: string;

  constructor(request) {

    this.messageId = request.body?.messageId;
    this.message = request.body?.message;
    this.chatId = request.body?.chatId;
  }
}

export class DeleteUserNotebooks {
  @IsOptional()
  @IsString()
  chatId!: string;

  @IsOptional()
  @IsString()
  debateId!: string;

  constructor(request) {
    this.chatId = request.body.chatId;
    this.debateId = request.body.debateId;
  }
}


export class GetChatListsRequest {
  constructor(request) {}
}

export class ExportChatLists {
  constructor(request) {}
}

export class DeleteMessage {
  @IsDefined()
  @IsString()
  chatId!: string;

  @IsDefined()
  @IsString()
  messageId!: string;

  constructor(request) {
    this.chatId = request.body.chatId;
    this.messageId = request.body.messageId;
  }
}

export class UpdateMessage {
  @IsDefined()
  @IsString()
  chatId!: string;

  @IsDefined()
  @IsString()
  messageId!: string;

  @IsDefined()
  @IsString()
  message: string;

  @IsDefined()
  @IsString()
  response!: string;

  constructor(request) {
    this.chatId = request.body.chatId;
    this.messageId = request.body.messageId;
    this.message = request.body.message;
    this.response = request.body.response;
  }
}


export class AddChatFeedback {
  @IsDefined()
  @IsString()
  chatId: string;

  @IsDefined()
  @IsObject()
  feedback: string;

  constructor(request) {
    this.chatId = request.body.chatId;
    this.feedback = request.body.feedback;
  }
}

export class StoreChatList {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  color: string;

  constructor(request) {
    this.title = request.body.title;
    this.color = request.body.color;
  }
}

export class UpdateChatListRequest {
  @IsDefined()
  @IsString()
  chatId!: string;

  @IsDefined()
  @IsString()
  chatListId!: string;

  constructor(request) {
    this.chatId = request.body.chatId;
    this.chatListId = request.body.chatListId;
  }
}