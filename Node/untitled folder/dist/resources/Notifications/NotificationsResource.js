"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class NotificationsResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "notificatiosn fetched successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        name: data.name,
        from: data.from,
        readBy: data.readBy,
        message: data.message,
        receivers: data.receivers,
        referenceId: data.referenceId,
        createdAt: data.createdAt
    };
}
exports.default = NotificationsResource;
//# sourceMappingURL=NotificationsResource.js.map