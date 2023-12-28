"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class HandleAudioResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while generating audio") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = data;
            super(ApiResponse_1.default.success(formattedData, "response generated successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        text: data.text,
        audioFilePath: data.audioFilePath,
        createdAt: data.createdAt,
        user: data.user,
        isDeleted: data.isDeleted,
        updatedAt: data.updatedAt,
        language: data.language,
        speed: data.speed,
    };
}
exports.default = HandleAudioResource;
//# sourceMappingURL=HandleAudioLibraryResource.js.map