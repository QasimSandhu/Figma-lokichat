"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ChatListResource extends ApiResponse_1.default {
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
        chatList: data.chatList,
        messages: data.messages,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}
function formatData(data) {
    var _a;
    const formattedChat = (_a = data.chats) === null || _a === void 0 ? void 0 : _a.map(formatChatData);
    return {
        chats: formattedChat,
        currentPage: data.currentPage,
        pages: data.pages,
        totalChats: data.totalChats,
        perPage: data.perPage,
        isAvailableChat: data.isAvailableChat
    };
}
exports.default = ChatListResource;
//# sourceMappingURL=ChatListResources.js.map