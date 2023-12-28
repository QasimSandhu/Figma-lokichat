"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateTime_1 = require("../lib/datetime/DateTime");
const goal_1 = require("../lib/constants/goal");
const Goal_1 = __importDefault(require("../models/Goal"));
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = require("lodash");
class GoalsService {
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, params } = req;
            const { status, page, perPage } = params;
            let completedGoals = yield Goal_1.default.find({ user: userId, status: goal_1.GOAL_STATUS.COMPLETED });
            let inProgressGoals = yield Goal_1.default.find({ user: userId, status: goal_1.GOAL_STATUS.INPROGRESS });
            completedGoals = completedGoals.sort((a, b) => b.completedAt - a.completedAt);
            inProgressGoals = inProgressGoals.sort((a, b) => a.dueOnDate - b.dueOnDate);
            return { inProgressGoals, completedGoals };
        });
    }
    indexByPagination(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, query } = req;
            const { status, page, perPage } = query;
            const statusFilter = {};
            const sortObject = {};
            if (status === goal_1.GOAL_STATUS.COMPLETED) {
                statusFilter.status = goal_1.GOAL_STATUS.COMPLETED;
                sortObject.completedAt = -1;
            }
            else if (status === goal_1.GOAL_STATUS.INPROGRESS) {
                statusFilter.status = goal_1.GOAL_STATUS.INPROGRESS;
                sortObject.dueOnDate = 1;
            }
            else
                throw new Error('Invalid status filter');
            const goals = yield Goal_1.default.find(Object.assign({ user: userId }, statusFilter)).sort(sortObject).skip((page - 1) * perPage).limit(perPage);
            const totalGoals = yield Goal_1.default.countDocuments(Object.assign({ user: userId }, statusFilter));
            return {
                goals,
                perPage,
                totalGoals,
                currentPage: page
            };
        });
    }
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { name, dueOnDate, notificationsReminder, reminderFrequency, keyPoint1, keyPoint2, keyPoint3 } = body;
            if (notificationsReminder && (!reminderFrequency || !keyPoint1 || (0, lodash_1.isEmpty)(keyPoint1)))
                throw new Error("required params are missing");
            if ((0, DateTime_1.isPast)(dueOnDate))
                throw new Error("Due on date must be in the future");
            const goal = new Goal_1.default({
                user: userId,
                name,
                status: goal_1.GOAL_STATUS.INPROGRESS,
                keyPoint1,
                keyPoint2,
                keyPoint3,
                dueOnDate,
                reminderFrequency,
                notificationsReminder,
            });
            yield goal.save();
            return goal;
        });
    }
    show(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { goalId } = body;
            const goal = yield Goal_1.default.findById(goalId);
            if (!goal)
                throw new Error("No Goal found with this goal ID");
            return goal;
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params } = req;
            const { goalId } = params;
            const goal = yield Goal_1.default.findByIdAndDelete(goalId);
            if (!goal)
                throw new Error("No Goal found with this goal ID");
            return goal;
        });
    }
    stats(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const statsPipeline = [
                { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: "$user",
                        totalInProgressGoals: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$status", "inprogress"] },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        totalCompletedGoals: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$status", "completed"] },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                    },
                },
            ];
            let pipelienResult = yield Goal_1.default.aggregate(statsPipeline);
            return {
                _id: pipelienResult[0]._id,
                totalInProgressGoals: pipelienResult[0].totalInProgressGoals,
                totalCompletedGoals: pipelienResult[0].totalCompletedGoals
            };
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { goalId, name, dueOnDate, notificationsReminder, status, keyPoint1, keyPoint2, keyPoint3 } = body;
            let { reminderFrequency } = body;
            //if (dueOnDate && isPast(dueOnDate))
            //  throw new Error("Due on date must be in the future");
            if (status && status !== goal_1.GOAL_STATUS.INPROGRESS && status !== goal_1.GOAL_STATUS.COMPLETED)
                throw new Error("Invalid status");
            const goal = yield Goal_1.default.findOne({ _id: goalId });
            if (!goal)
                throw new Error("No Goal found with this Id");
            if (notificationsReminder && !goal.reminderFrequency && !reminderFrequency)
                throw new Error("reminder frequency is required");
            if (notificationsReminder == false)
                reminderFrequency = null;
            if (status && status === goal_1.GOAL_STATUS.COMPLETED)
                goal.completedAt = new Date();
            goal.name = name || goal.name;
            goal.status = status || goal.status;
            goal.keyPoint1 = keyPoint1 || goal.keyPoint1;
            goal.keyPoint2 = keyPoint2;
            goal.keyPoint3 = keyPoint3;
            goal.dueOnDate = dueOnDate || goal.dueOnDate;
            goal.notificationsReminder =
                notificationsReminder == false || notificationsReminder == true
                    ? notificationsReminder
                    : goal.notificationsReminder;
            goal.reminderFrequency =
                notificationsReminder == false || notificationsReminder == true
                    ? reminderFrequency
                    : goal.reminderFrequency;
            yield goal.save();
            return goal;
        });
    }
}
exports.default = new GoalsService();
//# sourceMappingURL=GoalsService.js.map