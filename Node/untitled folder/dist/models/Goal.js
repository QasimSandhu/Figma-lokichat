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
const goal_1 = require("../lib/constants/goal");
const goal_2 = require("../lib/constants/goal");
const { oneHour, twoHours, fourHours, sixHours, oneDay, oneWeek, twoWeek, oneMonth, nullValue } = goal_2.REMINDER_FREQUENCY;
const goalSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dueOnDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: [goal_1.GOAL_STATUS.INPROGRESS, goal_1.GOAL_STATUS.COMPLETED],
        required: false,
    },
    notificationsReminder: {
        type: Boolean,
        required: true,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    keyPoint1: {
        type: String,
        required: false,
    },
    keyPoint2: {
        type: String,
        required: false,
    },
    keyPoint3: {
        type: String,
        required: false,
    },
    reminderFrequency: {
        type: String,
        enum: [oneHour, twoHours, fourHours, sixHours, oneDay, oneWeek, twoWeek, oneMonth, null],
        required: false,
        default: nullValue
    },
}, { timestamps: true });
const Goal = mongoose_1.default.model("Goal", goalSchema);
exports.default = Goal;
//# sourceMappingURL=Goal.js.map