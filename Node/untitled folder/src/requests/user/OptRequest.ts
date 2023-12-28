import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class OtpRequest {
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsNumber()
  otp!: number;

  constructor(request) {
    this.email = request?.body?.email;
    this.otp = request?.body?.otp;
  }
}

export class RequestOTPRequest {
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;

  constructor(request) {
    this.email = request?.body?.email;
  }
}

export class ResetPasswordRequest {
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  newPassword!: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  confirmNewPassword!: string;

  @IsOptional()
  @IsNumber()
  otp!: number;

  constructor(request) {
    this.email = request?.body?.email;
    this.newPassword = request?.body?.newPassword;
    this.confirmNewPassword = request?.body?.confirmNewPassword;
    this.otp = request?.body?.otp;
  }
}
