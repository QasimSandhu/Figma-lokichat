import { IsArray, IsDefined, IsString } from "class-validator";
import { IsStringOrNumber } from "../../lib/customValidators/CustomValidators";

export class GetSuperUserRequest {

    constructor(request) {}
  }

  export class StoreSuperUserRequest {
    @IsDefined()
    @IsString()
    description!: number;
  
    @IsDefined()
    @IsString()
    website!: string;

    @IsDefined()
    @IsArray()
    socialInfo: any;

    constructor(request) {
      this.description = request.body.description;
      this.website = request.body.website;
      this.socialInfo = request.body.socialInfo;
    }
  }

  export class UpdateSuperUserRequest {
    @IsDefined()
    @IsStringOrNumber()
    userToApprove!: number | string;
  
    @IsDefined()
    @IsString()
    status: string;

    constructor(request) {
      this.userToApprove = request.body.userToApprove;
      this.status = request.body.status;
    }
  }