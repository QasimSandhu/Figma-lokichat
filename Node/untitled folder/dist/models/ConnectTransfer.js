"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectTransferSchema = new mongoose_1.default.Schema({
    superUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    referalUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transferId: {
        type: String,
        required: true,
    },
    transferReversalId: {
        type: String,
        require: false
    },
    type: {
        type: String,
        enum: ['SEND', 'REVERSE'],
        default: 'SEND',
        required: true,
    }
}, { timestamps: true });
const ConnectTransfer = mongoose_1.default.model("ConnectTransfer", connectTransferSchema);
exports.default = ConnectTransfer;
//# sourceMappingURL=ConnectTransfer.js.map