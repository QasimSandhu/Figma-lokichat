import { IsDefined, IsString, Min } from "class-validator";

export class GetImageLibrary {
    constructor(request) {}
}

export class UpdateImageLibrary {
    @IsDefined()
    @IsString()
    imageId!: string;
    
    @IsDefined()
    @IsString()
    prompt!: string;

    constructor(request) {
        this.imageId = request?.body?.imageId;
        this.prompt = request?.body?.prompt;
    }
}

export class DestroyImageLibrary {
    constructor(request){}
}