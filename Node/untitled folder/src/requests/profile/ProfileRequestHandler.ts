import { IsDefined } from 'class-validator'

export class DestroyProfile {
    @IsDefined()
    password!: any;
  
    constructor(request) {
      this.password = request?.body?.password;  
    }
  }

  