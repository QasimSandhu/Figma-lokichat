"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class VerifyOtpResource extends ApiResponse_1.default {
    constructor(data, message = 'Invalid OTP data') {
        if (!data) {
            super(ApiResponse_1.default.error(message));
        }
        else {
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse_1.default.success(formattedData, 'OTP verified successfully'));
        }
    }
}
function formatData(data) {
    return {
        email: data.email,
        otp: data.otp,
        isOtpVerified: data.isOtpVerified,
    };
}
exports.default = VerifyOtpResource;
//# sourceMappingURL=VerifyOtpResource.js.map