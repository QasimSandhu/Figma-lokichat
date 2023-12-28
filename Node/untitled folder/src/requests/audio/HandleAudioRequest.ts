import { IsDefined, IsOptional, IsString } from "class-validator";

export class HandleAudioRequest {
  @IsDefined()
  @IsString()
  text!: string;

  @IsOptional()
  @IsString()
  chatId!: string;

  @IsOptional()
  @IsString()
  debateId!: string;

  @IsDefined()
  @IsString()
  voiceMode!: string;

  @IsDefined()
  @IsString()
  gender!: string;

  @IsDefined()
  @IsString()
  language!: string;

  @IsDefined()
  @IsString()
  voiceName!: string;

  @IsOptional()
  @IsString()
  audioLabel!: string;

  constructor(request) {
    this.text = request?.body?.text;
    this.chatId = request?.body?.chatId;
    this.gender = request?.body?.gender;
    this.language = request?.body?.language;
    this.audioLabel = request?.body?.audioLabel;
    this.voiceName = request?.body?.voiceName;
    this.voiceMode = request?.body?.voiceMode;
  }
}

export class ShowAudioRequest {

  @IsDefined()
  @IsString()
  audioId!: string;

  constructor(request) {
    this.audioId = request?.body?.audioId;
  }
}

export class UpdateAudioRequest {

  @IsDefined()
  @IsString()
  audioId!: string;

  @IsDefined()
  @IsString()
  text!: string;

  @IsDefined()
  @IsString()
  voiceMode!: string;

  constructor(request) {
    this.audioId = request?.body?.audioId;
    this.voiceMode = request?.body?.voiceMode;
    this.text = request?.body?.text;
  }
}