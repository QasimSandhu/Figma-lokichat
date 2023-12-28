"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const user_1 = require("../lib/constants/user");
const superUserSchema = new mongoose_2.Schema({
    user: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    approvedBy: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    status: {
        type: String,
        enum: [
            user_1.SUPER_USER_STATUS.PENDING,
            user_1.SUPER_USER_STATUS.APPROVED,
            user_1.SUPER_USER_STATUS.APPROVED,
        ],
        required: true,
        default: user_1.SUPER_USER_STATUS.PENDING,
    },
    statusUpdatedDate: {
        type: Date,
        default: Date.now(),
    },
    description: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: false,
    },
    stripeConnectAccountId: {
        type: String
    },
    socialInfo: [
        {
            userName: {
                type: String,
                required: true,
            },
            platform: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
const SuperUser = mongoose_1.default.model("SuperUser", superUserSchema);
exports.default = SuperUser;
//# sourceMappingURL=SuperUser.js.map