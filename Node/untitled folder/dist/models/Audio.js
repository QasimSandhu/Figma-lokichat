"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chats_1 = require("../lib/constants/chats");
const audioSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ChatGpt",
        required: false,
        default: null
    },
    debate: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Debate",
        required: false,
        default: null
    },
    text: {
        type: String,
        required: true,
    },
    audioLabel: {
        type: String,
        default: null,
        required: false,
    },
    audioColor: {
        type: String,
        default: null,
        required: false,
    },
    voiceIdentifier: {
        type: String,
        required: true,
    },
    voiceMode: {
        type: String,
        default: 'default',
    },
    language: {
        type: String,
        default: chats_1.CHAT_LANGUAGES.EN,
        required: true,
    },
    speakerName: {
        type: String,
        required: false,
    },
    editedText: {
        type: String,
        required: false,
    },
    audioFilePath: {
        type: String,
        required: true,
    },
    sharedTo: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        }],
    sharedFrom: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const Audio = mongoose_1.default.model("Audio", audioSchema);
exports.default = Audio;
//# sourceMappingURL=Audio.js.map