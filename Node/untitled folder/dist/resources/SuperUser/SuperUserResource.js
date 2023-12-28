"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class SuperUserResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, " superuser created successfully"));
        }
    }
}
function formatData(data) {
    const formattedSocialInfo = data.socialInfo.map(formatSocialInfo);
    return {
        id: data._id,
        user: data.user,
        status: data.status,
        website: data.website,
        approvedBy: data.approvedBy,
        description: data.description,
        socialInfo: formattedSocialInfo || [],
        statusUpdatedDate: data.statusUpdatedDate,
        createdAt: data.createdAt,
    };
    function formatSocialInfo(data) {
        return {
            id: data._id,
            userName: data.userName,
            platform: data.platform,
        };
    }
}
exports.default = SuperUserResource;
//# sourceMappingURL=SuperUserResource.js.map