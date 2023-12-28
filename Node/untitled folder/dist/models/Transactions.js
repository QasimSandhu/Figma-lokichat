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
const transactionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    referralSuperUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    paymentId: {
        type: String,
        required: true,
    },
    subscription: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true,
    },
    plan: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Available'],
        default: 'Pending'
    },
    deliveryStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    balanceTransaction: {
        type: String,
        required: false
    },
    available_on: {
        type: Number,
        required: false
    },
    refferalConnectAccountTransferid: {
        type: String,
        required: false
    },
    isRefferedAmount: {
        type: Boolean,
        default: false
    },
    campaignId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Compain", required: false },
    deleiveredAt: { type: Date },
}, { timestamps: true });
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=Transactions.js.map