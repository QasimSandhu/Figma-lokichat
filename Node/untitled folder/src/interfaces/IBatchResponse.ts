import { AxiosResponseHeaders, RawAxiosResponseHeaders, AxiosResponse } from "axios";

export interface SubmitBatchResponse {
    success: boolean,
    status?: number,
    translatedFileUrl?:string;
    data?: any,
    headers?: RawAxiosResponseHeaders | AxiosResponseHeaders,
    statusText?: string,
    config?: any,
    request?: any,
    stringError?:string,
    message?: string,
    code?:string,
    response?:AxiosResponse<any, any> | any | unknown
}