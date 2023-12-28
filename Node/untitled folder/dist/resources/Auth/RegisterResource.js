"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class RegisterResource extends ApiResponse_1.default {
    constructor(data, error = 'Server Error') {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse_1.default.success(formattedData, 'OTP sent successfully'));
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
        subscription: data.subscription,
        profileUrl: data.profileUrl
    };
}
exports.default = RegisterResource;
//# sourceMappingURL=RegisterResource.js.map