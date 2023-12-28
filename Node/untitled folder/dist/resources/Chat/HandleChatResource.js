"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class HandleChatResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while generating chat") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "response generated successfully"));
        }
    }
}
function formatData(data) {
    return {
        chatId: data.chatId,
        title: data.title,
        color: data.color,
        message: data.message,
        response: data.response,
        messageId: data.messageId,
        responseTo: data.responseTo,
        createdAt: data.createdAt,
    };
}
exports.default = HandleChatResource;
//# sourceMappingURL=HandleChatResource.js.map