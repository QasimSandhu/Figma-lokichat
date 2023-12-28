"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notebookSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ChatGpt",
        required: false,
        default: null,
    },
    debate: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Debate",
        required: false,
        default: null,
    },
    messageId: {
        type: String,
        required: false,
    },
    contenType: {
        type: String,
        enum: ["file", "message"],
        required: true,
        default: "message"
    },
    response: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Notebook = mongoose_1.default.model("Notebook", notebookSchema);
exports.default = Notebook;
//# sourceMappingURL=Notebook.js.map