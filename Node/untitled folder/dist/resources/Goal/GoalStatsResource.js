"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class GoalStatsResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = Array.isArray(data)
                ? data.map(formatData)
                : formatData(data);
            super(ApiResponse_1.default.success(formattedData, "goal stats fetched successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        totalInProgressGoals: data.totalInProgressGoals,
        totalCompletedGoals: data.totalCompletedGoals
    };
}
exports.default = GoalStatsResource;
//# sourceMappingURL=GoalStatsResource.js.map