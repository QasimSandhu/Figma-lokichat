"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class UpdateChatListsResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while generating chat") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "Chat list updated successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        chatList: data.chatList,
        feedback: data.feedback,
        createdAt: data.createdAt,
    };
}
exports.default = UpdateChatListsResource;
//# sourceMappingURL=UpdateChatListResource.js.map