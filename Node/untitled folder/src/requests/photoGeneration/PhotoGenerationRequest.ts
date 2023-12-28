import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from "class-validator";

export class PhotoGenerationRequest {
  @IsDefined()
  @IsString()
  prompt!: string;

  @IsDefined()
  @IsNumber()
  noOfImages!: number;

  @IsOptional()
  @IsString()
  negativePrompt!: string;

  @IsOptional()
  @IsNumber()
  interferenceSteps!: number;

  @IsDefined()
  @IsNumber()
  width: number;

  @IsDefined()
  @IsNumber()
  height: number;

  @IsDefined()
  @IsNumber()
  guidanceScale: number;

  @IsDefined()
  @IsBoolean()
  enhancePrompt: boolean;

  @IsDefined()
  @IsBoolean()
  isNSFW: boolean;      // is Not Safe For Work

  constructor(request) {
    this.prompt = request?.body?.prompt;
    this.noOfImages = request?.body?.noOfImages;
    this.negativePrompt = request?.body?.negativePrompt;
    this.interferenceSteps = request?.body?.interferenceSteps;
    this.width = request?.body?.width;
    this.height = request?.body?.height;
    this.guidanceScale = request?.body?.guidanceScale;
    this.enhancePrompt = request?.body?.enhancePrompt;
    this.isNSFW = request?.body?.isNSFW;
  }
}

export class UpdateGeneratedPhoto {
  @IsDefined()
  @IsString()
  messageId!: string;

  @IsDefined()
  @IsString()
  message!: string;

  @IsDefined()
  @IsString()
  photoGeneratedId!: string;

  constructor(request) {

    this.messageId = request?.body?.messageId;
    this.message = request?.body?.message;
    this.photoGeneratedId = request?.body?.photoGeneratedId;
  }
}

export class QueuedPhotoRequest {
  @IsDefined()
  @IsNumber()
  imageId: number;

  @IsDefined()
  @IsString()
  photoId!: string;

  constructor(request) {
    this.imageId = request?.body?.imageId;
    this.photoId = request?.body?.photoId;
  }
}