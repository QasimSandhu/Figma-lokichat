"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class GetGoalResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedCompletedGoals = Array.isArray(data.completedGoals)
                ? data.completedGoals.map(formatData)
                : formatData(data.completedGoals);
            const formattedInProgressGoals = Array.isArray(data.inProgressGoals)
                ? data.inProgressGoals.map(formatData)
                : formatData(data.inProgressGoals);
            const formattedData = { completedGoals: formattedCompletedGoals, inProgressGoals: formattedInProgressGoals };
            super(ApiResponse_1.default.success(formattedData, "goals fetched successfully"));
        }
    }
}
function formatData(data) {
    return {
        id: data._id,
        name: data.name,
        status: data.status,
        dueOnDate: data.dueOnDate,
        keyPoint1: data.keyPoint1,
        keyPoint2: data.keyPoint2,
        keyPoint3: data.keyPoint3,
        createdAt: data.createdAt,
        completedAt: data.completedAt,
        reminderFrequency: data.reminderFrequency,
        notificationsReminder: data.notificationsReminder,
    };
}
exports.default = GetGoalResource;
//# sourceMappingURL=GetGoalResources.js.map