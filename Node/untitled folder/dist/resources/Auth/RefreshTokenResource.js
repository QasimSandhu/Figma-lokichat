"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class RefreshTokenResource extends ApiResponse_1.default {
    constructor(data, error = "Server Error") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = formatData(data);
            super(ApiResponse_1.default.success(formattedData, "Token refreshed successfully"));
        }
    }
}
function formatData(data) {
    return {
        token: data.token,
        refreshToken: data.refreshToken,
    };
}
exports.default = RefreshTokenResource;
//# sourceMappingURL=RefreshTokenResource.js.map