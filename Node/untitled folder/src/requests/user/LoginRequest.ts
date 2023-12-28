import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class LoginRequest {
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsDefined()
  @IsString()
  os!: string;

  @IsOptional()
  @IsString()
  browserName!: string;

  @IsOptional()
  @IsString()
  browserVersion!: string;

  @IsOptional()
  @IsString()
  mobileId!: string;

  @IsOptional()
  @IsString()
  mobileName!: string;

  @IsDefined()
  @IsString()
  ipAddress!: string;

  constructor(request) {
    this.email = request.body.email;
    this.password = request.body.password;
    this.os = request.body.os;
    this.browserName = request.body.browserName;
    this.browserVersion = request.body.browserVersion;
    this.mobileId = request.body.mobileId;
    this.mobileName = request.body.mobileName;
    this.ipAddress = request?.body.ipAddress;
  }
}

export class RefreshTokenRequest {
  @IsDefined()
  @IsString()
  refreshToken!: string;

  @IsDefined()
  @IsString()
  userId: string;

  constructor(request) {
    this.refreshToken = request.body.refreshToken;
    this.userId = request.body.userId;
  }
}
