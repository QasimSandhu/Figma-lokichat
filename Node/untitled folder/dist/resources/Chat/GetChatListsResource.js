"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class GetChatListsResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while generating chat") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = {};
            for (const key in data) {
                const value = formatDataKeys(data[key]);
                formattedData[key] = value;
            }
            super(ApiResponse_1.default.success(formattedData, "Chat list fetched successfully"));
        }
    }
}
function formatDataKeys(data) {
    if ((0, lodash_1.size)(data) > 0) {
        const formattedChat = Array.isArray(data)
            ? data.map(formatData)
            : formatData(data);
        return formattedChat;
    }
    else
        return [];
}
function formatData(data) {
    const formattedMessages = Array.isArray(data.messages)
        ? data.messages.map(formatMessages)
        : formatMessages(data.messages);
    return {
        id: data._id,
        messages: formattedMessages,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
}
function formatMessages(message) {
    return {
        id: message._id,
        messageId: message.messageId,
        sender: message.sender,
        content: message.content,
    };
}
exports.default = GetChatListsResource;
//# sourceMappingURL=GetChatListsResource.js.map