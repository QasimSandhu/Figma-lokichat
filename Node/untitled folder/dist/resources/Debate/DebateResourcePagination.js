"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class DebateResourcePagination extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = formatData(data);
            super(ApiResponse_1.default.success(formattedData, "debates fetched successfully"));
        }
    }
}
function formatMessage(message) {
    return {
        id: message._id,
        sender: message.sender,
        message: message.message,
        mentionedUsers: message.mentionedUsers,
        isBotMentioned: message.isBotMentioned,
        isBotResponse: message.isBotResponse,
        responseTo: message.responseTo,
        createdAt: message.createdAt,
    };
}
function formatDebates(debates) {
    var _a;
    const formattedMessages = (_a = debates.messages) === null || _a === void 0 ? void 0 : _a.map(formatMessage);
    return {
        id: debates._id,
        title: debates.title,
        invitedUsers: debates.invitedUsers,
        messages: formattedMessages,
        unreadMessages: debates.unreadMessages,
        createdAt: debates.createdAt,
        updatedAt: debates.updatedAt,
    };
}
function formatData(data) {
    const formattedDebates = Array.isArray(data.debates)
        ? data.debates.map(formatDebates)
        : formatDebates(data.debates);
    return {
        debates: formattedDebates,
        currentPage: data.currentPage,
        pages: data.pages,
        totalDebates: data.totalDebates,
        perPage: data.perPage,
        isAvailableRecords: data.isAvailableRecords
    };
}
exports.default = DebateResourcePagination;
//# sourceMappingURL=DebateResourcePagination.js.map