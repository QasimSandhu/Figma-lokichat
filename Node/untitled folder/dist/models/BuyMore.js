"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BuyMoreSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    }
}, { timestamps: true });
const BuyMore = mongoose_1.default.model("BuyMore", BuyMoreSchema);
exports.default = BuyMore;
//# sourceMappingURL=BuyMore.js.map