"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    addedInNotebook: {
        type: Boolean,
        default: false,
    },
    mentionedUsers: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
            required: false,
        }],
    readBy: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
            required: false,
        }],
    isBotMentioned: {
        type: Boolean,
        default: false,
    },
    isBotResponse: {
        type: Boolean,
        default: false,
    },
    responseTo: {
        type: String,
        default: null,
    },
}, { timestamps: true });
const invitedUsersSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });
const leaveDebateUsersSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });
const removedUsersSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });
const debateSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    // invitedUsers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // }],
    // leavedDebateUsers: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   default: null,
    // }],
    // removedDebateUsers: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   default: null,
    // }],
    invitedUsers: [invitedUsersSchema],
    leavedDebateUsers: [leaveDebateUsersSchema],
    removedDebateUsers: [removedUsersSchema],
    messages: {
        type: [messageSchema],
        default: [],
        required: false
    }
}, { timestamps: true });
const Debate = mongoose_1.default.model("Debate", debateSchema);
exports.default = Debate;
//# sourceMappingURL=Debate.js.map