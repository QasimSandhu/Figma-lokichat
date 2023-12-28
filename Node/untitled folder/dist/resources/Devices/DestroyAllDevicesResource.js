"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class DestroyAllDevices extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = formatData(data);
            super(ApiResponse_1.default.success(formattedData, "user logged out from all devices"));
        }
    }
}
function formatData(data) {
    return {
        deletedCount: data.deletedCount,
        acknowledged: data.acknowledged
    };
}
exports.default = DestroyAllDevices;
//# sourceMappingURL=DestroyAllDevicesResource.js.map