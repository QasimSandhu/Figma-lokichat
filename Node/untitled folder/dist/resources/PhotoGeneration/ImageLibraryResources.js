"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ImageLibraryResources extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while fetching Images") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data.images)
                ? data.images.map(formatData)
                : formatData(data.images);
            const returnedFormattedData = { totalCount: data.totalCount, images: formattedData };
            super(ApiResponse_1.default.success(returnedFormattedData, "Image Library Fetched Successfully!"));
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
exports.default = ImageLibraryResources;
//# sourceMappingURL=ImageLibraryResources.js.map