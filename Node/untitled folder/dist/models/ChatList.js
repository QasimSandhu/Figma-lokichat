"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatListSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: null,
    },
    color: {
        type: String,
        required: false,
        default: null,
    },
}, { timestamps: true });
const ChatList = mongoose_1.default.model("ChatList", chatListSchema);
exports.default = ChatList;
//# sourceMappingURL=ChatList.js.map