"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chats_1 = require("../lib/constants/chats");
const messageSchema = new mongoose_1.default.Schema({
    messageId: {
        type: String,
        required: true,
        unique: false,
    },
    sender: {
        type: String,
        enum: [chats_1.CHAT_ROLES.USER, chats_1.CHAT_ROLES.ASSISTANT, chats_1.CHAT_ROLES.CHATBOT],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    addedInNotebook: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    responseTo: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        required: false
    }
});
const chatGptSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chatList: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ChatList",
        default: null
    },
    messages: {
        type: [messageSchema],
        default: [],
        required: false
    },
    type: { type: String, enum: [chats_1.CHAT_TYPE.CHAT, chats_1.CHAT_TYPE.SUMMARY, chats_1.CHAT_TYPE.EXAM], default: chats_1.CHAT_TYPE.CHAT },
    chatModel: { type: String, required: false },
    feedback: {
        rating: { type: Number, required: false },
        comment: { type: String, required: false }
    },
}, { timestamps: true });
const ChatGpt = mongoose_1.default.model("ChatGpt", chatGptSchema);
exports.default = ChatGpt;
//# sourceMappingURL=Chat.js.map