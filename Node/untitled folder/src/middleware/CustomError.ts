class CustomError extends Error {
    statusCode: any;
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }

  export default CustomError;