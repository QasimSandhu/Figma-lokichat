"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ReferralVerifyResource extends ApiResponse_1.default {
    constructor(data, error = "Something went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            if (formattedData.isVerified) {
                super(ApiResponse_1.default.success(formattedData, "Verified successfully"));
            }
            else {
                super(ApiResponse_1.default.error("Verification failed"));
            }
        }
    }
}
function formatData(data) {
    return {
        isVerified: data.isVerified,
    };
}
exports.default = ReferralVerifyResource;
//# sourceMappingURL=HandleReferralVerifyResource.js.map