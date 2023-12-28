"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class InviteUserResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = data;
            super(ApiResponse_1.default.success(formattedData, "Successfully invited"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        title: data.title,
        description: data.description,
        creator: data.creator
    };
}
exports.default = InviteUserResource;
//# sourceMappingURL=HandleInviteUserResource.js.map