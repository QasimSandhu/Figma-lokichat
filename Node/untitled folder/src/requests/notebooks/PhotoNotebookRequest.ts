import { IsDefined, IsString } from 'class-validator'

export class AddToLiveNotebook {
    @IsDefined()
    @IsString()
    photoGeneratedId!: string;
  
    @IsDefined()
    @IsString()
    message!: string;
  
    @IsDefined()
    @IsString()
    response!: string;
  
    @IsDefined()
    @IsString()
    messageId!: string;
  
    constructor(request) {
      this.photoGeneratedId = request?.body?.photoGeneratedId;
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
  
  