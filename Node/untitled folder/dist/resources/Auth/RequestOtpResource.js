"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class RequestOtpResource extends ApiResponse_1.default {
    constructor(data, message = 'Email not found') {
        if (!data) {
            super(ApiResponse_1.default.error(message));
        }
        else {
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse_1.default.success(formattedData, message));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        email: data.email,
        userName: data.userName,
        otpExpiresAt: data.otpExpiresAt,
        isOtpVerified: data.isOtpVerified,
    };
}
exports.default = RequestOtpResource;
//# sourceMappingURL=RequestOtpResource.js.map