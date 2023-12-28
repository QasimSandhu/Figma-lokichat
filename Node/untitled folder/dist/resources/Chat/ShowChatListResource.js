"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ShowChatListResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while generating chat list") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "chat list fetched successfully"));
        }
    }
}
function formatChatData(data) {
    return {
        id: data._id,
        messages: data.messages,
        createdAt: data.createdAt,
    };
}
function formatData(data) {
    const formattedChat = {
        today: data.chatData.today.map(formatChatData),
        lastWeek: data.chatData.lastWeek.map(formatChatData),
        last30Days: data.chatData.last30Days.map(formatChatData),
        older: data.chatData.older.map(formatChatData)
    };
    return {
        id: data.id,
        title: data.title,
        color: data.color,
        chats: formattedChat,
        createdAt: data.createdAt,
    };
}
exports.default = ShowChatListResource;
//# sourceMappingURL=ShowChatListResource.js.map