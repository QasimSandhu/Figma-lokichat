"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class HandleProfileResoruce extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while updating profile") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "Pofile updated successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        email: data.email,
        avatar: data.avatar,
        userName: data.userName,
        bio: data.bio,
        profileUrl: data.profileUrl,
        subscription: data.subscription,
        referralCode: data.referralCode,
        gmailProvider: data.gmailProvider,
        gmailProviderId: data.gmailProviderId,
        appleProvider: data.appleProvider,
        appleProviderId: data.appleProviderId,
    };
}
exports.default = HandleProfileResoruce;
//# sourceMappingURL=HandleProfileResource.js.map