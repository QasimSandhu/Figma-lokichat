"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    save: {
        type: Number,
        required: true,
    },
    plans: [
        {
            title: {
                type: String,
                required: true,
            },
            stripeId: {
                type: String,
                required: true,
            },
            popular: {
                type: Boolean,
                default: true,
            },
            currentPlan: {
                type: Boolean,
                default: false,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            priceDetails: {
                type: String,
                required: true,
            },
            audioAllowed: {
                type: Number,
                required: true,
            },
            imagesAllowed: {
                type: Number,
                required: true,
            },
            wordsAllowed: {
                type: Number,
                required: true,
            },
            details: [{ type: String }],
        },
    ],
}, { timestamps: true });
const Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);
exports.default = Subscription;
//# sourceMappingURL=Subscription.js.map