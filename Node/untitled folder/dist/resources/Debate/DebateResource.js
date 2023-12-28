"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class DebateResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "debate created successfully"));
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
        createdAt: message.createdAt
    };
}
function formatUsers(invitedUserObj) {
    const user = invitedUserObj.user;
    // return {
    // user._id: message._id,
    // user.sender: message.sender,
    // user.message: message.message,
    // };
    return user;
}
function formatData(data) {
    var _a, _b;
    const formattedMessages = (_a = data.messages) === null || _a === void 0 ? void 0 : _a.map(formatMessage);
    const formattedInvitedUsers = (_b = data.invitedUsers) === null || _b === void 0 ? void 0 : _b.map(formatUsers);
    return {
        id: data._id,
        user: data.user,
        title: data.title,
        invitedUsers: formattedInvitedUsers,
        leavedDebateUsers: data.leavedDebateUsers,
        removedDebateUsers: data.removedDebateUsers,
        messages: formattedMessages,
        createdAt: data.createdAt
    };
}
exports.default = DebateResource;
//# sourceMappingURL=DebateResource.js.map