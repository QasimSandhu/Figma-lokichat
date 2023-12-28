"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const translationsSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // chat: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ChatGpt",
    //   required: true,
    // },
    originalDocumentUrl: {
        type: String,
        required: true,
    },
    translatedDocumentUrl: {
        type: String,
        required: true,
    },
    totalCharacterCharged: {
        type: Number,
        required: true
    },
    getRequestBatchUrl: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['TEXT', 'DOCUMENT'],
        required: true,
    },
    translatedLanguage: {
        type: String,
        required: true,
    }
}, { timestamps: true });
const Translation = mongoose_1.default.model("Translation", translationsSchema);
exports.default = Translation;
//# sourceMappingURL=Translations.js.map