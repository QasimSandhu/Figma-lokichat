"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class HandleGenerateTextResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while adding livenotebook") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(data, "Text Fetched  successfully"));
        }
    }
}
function formatData(data) {
    return {
        text: data.text,
    };
}
exports.default = HandleGenerateTextResource;
//# sourceMappingURL=GenerateTextResource.js.map