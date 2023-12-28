interface ApiResponseProps {
    success: boolean;
    data: any;
    message: string;
    status: number;
  }
  
  class ApiResponse {
    public success: boolean;
    public data: any;
    public message: string;
    public status: number;
  
    constructor({ success, data, message, status }: ApiResponseProps) {
      this.success = success;
      this.data = data;
      this.message = message;
      this.status = status;
    }
  
    static success(data: any, message: string, status = 200): ApiResponse {
      return new ApiResponse({ success: true, data, message, status });
    }
  
    static error(message: string, data: any = null, status = 500): ApiResponse {
      return new ApiResponse({ success: false, data, message, status });
    }
  
    toJson(): ApiResponseProps {
      return {
        success: this.success,
        data: this.data,
        message: this.message,
        status: this.status
      };
    }
  }
  
  export default ApiResponse;
  