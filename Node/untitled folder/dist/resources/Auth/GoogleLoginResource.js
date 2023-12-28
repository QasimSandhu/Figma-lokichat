"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class GoogleLoginResource extends ApiResponse_1.default {
    constructor(data, error = "Invalid email or password", status = 200) {
        if (!data) {
            super(ApiResponse_1.default.error(error, null, status));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.error("Enter valid referral code to login.", formattedData, 200));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        email: data.email,
        userName: data.userName,
        token: data.token,
        bio: data.bio,
        subscription: data.subscription,
        profileUrl: data.profileUrl,
        referralCode: data.referralCode,
        invitedUsers: data.invitedUsers,
        subscribedUser: data.subscribedUser,
        refreshToken: data.refreshToken,
        gmailProvider: data.gmailProvider,
        gmailProviderId: data.gmailProviderId,
        appleProvider: data.appleProvider,
        appleProviderId: data.appleProviderId,
        role: data.role,
        subscribedDate: data.subscribedDate,
        isReferralVerified: data.isReferralVerified
    };
}
exports.default = GoogleLoginResource;
//# sourceMappingURL=GoogleLoginResource.js.map