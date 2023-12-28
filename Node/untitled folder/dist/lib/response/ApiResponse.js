"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor({ success, data, message, status }) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.status = status;
    }
    static success(data, message, status = 200) {
        return new ApiResponse({ success: true, data, message, status });
    }
    static error(message, data = null, status = 500) {
        return new ApiResponse({ success: false, data, message, status });
    }
    toJson() {
        return {
            success: this.success,
            data: this.data,
            message: this.message,
            status: this.status
        };
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map