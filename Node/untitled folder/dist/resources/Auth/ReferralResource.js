"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ReferralResource extends ApiResponse_1.default {
    constructor(data, error = "Invalid email or password") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "data fetched successful"));
        }
    }
}
function formatData(data) {
    return {
        _id: data._id,
        email: data.email,
        userName: data.userName,
        subscription: data.subscription,
        invitedUsers: data.invitedUsers,
        subscribedUser: data.subscribedUser,
        inviteUserCount: data.inviteUserCount,
        imagesCount: data.imagesCount,
        audioCount: data.audioCount,
        wordsCount: data.wordsCount,
        profileUrl: data.profileUrl,
        subscribedDate: data.subscribedDate,
        loggedInUsersCount: data.loggedInUsersCount,
        loggedInUsers: data.loggedInUsers,
        subscribedUserCount: data.subscribedUserCount,
        subscriptionsLeft: data === null || data === void 0 ? void 0 : data.subscriptionsLeft,
    };
}
exports.default = ReferralResource;
//# sourceMappingURL=ReferralResource.js.map