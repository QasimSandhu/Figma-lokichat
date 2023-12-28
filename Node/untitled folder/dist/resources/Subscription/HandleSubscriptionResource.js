"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class SubscriptionResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "plan created successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        title: data.title,
        type: data.type,
        priceSemester: data.priceSemester,
        priceMonth: data.priceMonth,
        priceYear: data.priceYear,
        isRegular: data.isRegular,
        referralPrice: data.referralPrice,
        description: data.description,
        createdAt: data.createdAt,
        save: data.save,
        plans: data.plans,
        updatedAt: data.updatedAt,
        imagesAllowed: data.imagesAllowed,
        wordsAllowed: data.wordsAllowed,
        audioAllowed: data.audioAllowed,
    };
}
exports.default = SubscriptionResource;
//# sourceMappingURL=HandleSubscriptionResource.js.map