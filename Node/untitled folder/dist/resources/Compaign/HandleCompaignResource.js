"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class CompaignResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = data;
            super(ApiResponse_1.default.success(formattedData, "Comapaign fetched successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        title: data.title,
        description: data.description,
        creator: data.creator
    };
}
exports.default = CompaignResource;
//# sourceMappingURL=HandleCompaignResource.js.map