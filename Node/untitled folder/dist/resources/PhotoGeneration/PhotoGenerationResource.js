"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class PhotoGenerationResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while generating AI Photos") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "photo generated successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        eta: data.eta,
        prompt: data.prompt,
        imageId: data.imageId,
        createdAt: data.createdAt,
        imagePathUrls: data.imagePathUrls,
    };
}
exports.default = PhotoGenerationResource;
//# sourceMappingURL=PhotoGenerationResource.js.map