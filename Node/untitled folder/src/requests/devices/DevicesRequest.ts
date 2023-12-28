import { IsDefined, IsString } from "class-validator";
  
  export class StoreLoggedInDevice {
    @IsDefined()
    @IsString()
    browserName!: string;

    @IsDefined()
    @IsString()
    os!: string;

    @IsDefined()
    @IsString()
    browserVersion!: string;

    @IsDefined()
    @IsString()
    ipAddress!: string;

    constructor(request) {
      this.os = request.body.os;
      this.browserName = request.body.browserName;
      this.browserVersion = request.body.browserVersion;
      this.ipAddress = request.body.ipAddress
    }
  }

  export class IndexLoggedInDevices {}
  export class DestroyLoggedInDevice {}
  export class DestroyAllDevices {}
  