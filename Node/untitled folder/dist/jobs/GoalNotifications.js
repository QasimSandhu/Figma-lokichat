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
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const Goal_1 = __importDefault(require("../models/Goal"));
const User_1 = __importDefault(require("../models/User"));
const Notifications_1 = __importDefault(require("../models/Notifications"));
const goal_1 = require("../lib/constants/goal");
const express_1 = __importDefault(require("express"));
const SocketIO_1 = require("../classes/SocketIO");
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const lodash_1 = require("lodash");
const socket = new SocketIO_1.Socket();
const router = express_1.default.Router();
const { oneHour, twoHours, fourHours, sixHours, oneDay, oneWeek, twoWeek, oneMonth, } = goal_1.REMINDER_FREQUENCY;
const oneHourBeforeDayEnd = "0 23 * * *"; // one hour before
const twoHoursBeforeDayEnd = "0 22 * * *"; // two hours before
const fourHoursBeforeDayEnd = "0 20 * * *"; // four hours before
const sixHoursBeforeDayEnd = "0 18 * * *"; // six hours before
const oneDayBefore = "0 0 * * *"; // At 12:00 AM of Every Night
const everydayAtFiveFiftyFivePM = "55 17 * * *"; // At 5:55 PM every day
// Schedule the cron job
node_cron_1.default.schedule(oneHourBeforeDayEnd, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = (0, moment_1.default)();
        const tomorrow = (0, moment_1.default)().add(1, "days").startOf("day");
        const goals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: oneHour,
            dueOnDate: {
                $gte: currentTime.startOf("day").toDate(),
                $lt: tomorrow.toDate(),
            },
        });
        if ((0, lodash_1.size)(goals) > 0) {
            yield sendGoalExpirationReminder(goals);
        }
    }
    catch (error) {
        console.error("Goal Notifications One Hour Before Error:", error);
    }
}));
node_cron_1.default.schedule(twoHoursBeforeDayEnd, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = (0, moment_1.default)();
        const tomorrow = (0, moment_1.default)().add(1, "days").startOf("day");
        const goals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: twoHours,
            dueOnDate: {
                $gte: currentTime.startOf("day").toDate(),
                $lt: tomorrow.toDate(),
            },
        });
        if ((0, lodash_1.size)(goals) > 0) {
            yield sendGoalExpirationReminder(goals);
        }
    }
    catch (error) {
        console.error("Goal Notifications Two Hours Before Error:", error);
    }
}));
node_cron_1.default.schedule(fourHoursBeforeDayEnd, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = (0, moment_1.default)();
        const tomorrow = (0, moment_1.default)().add(1, "days").startOf("day");
        const goals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: fourHours,
            dueOnDate: {
                $gte: currentTime.startOf("day").toDate(),
                $lt: tomorrow.toDate(),
            },
        });
        if ((0, lodash_1.size)(goals) > 0) {
            yield sendGoalExpirationReminder(goals);
        }
    }
    catch (error) {
        console.error("Goal Notifications Four Hours Before Error:", error);
    }
}));
node_cron_1.default.schedule(sixHoursBeforeDayEnd, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = (0, moment_1.default)();
        const tomorrow = (0, moment_1.default)().add(1, "days").startOf("day");
        const goals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: sixHours,
            dueOnDate: {
                $gte: currentTime.startOf("day").toDate(),
                $lt: tomorrow.toDate(),
            },
        });
        if ((0, lodash_1.size)(goals) > 0) {
            yield sendGoalExpirationReminder(goals);
        }
    }
    catch (error) {
        console.error("Goal Notifications Six Hours Before Error:", error);
    }
}));
// This is some how special, here some updations are requried
node_cron_1.default.schedule(oneDayBefore, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = (0, moment_1.default)();
        const oneDayBefore = (0, moment_1.default)().add(2, "days").startOf("day");
        const oneWeekBefore = (0, moment_1.default)().add(1, "weeks").startOf("day");
        const twoWeekBefore = (0, moment_1.default)().add(2, "weeks").startOf("day");
        const oneMonthBefore = (0, moment_1.default)().add(1, 'months').startOf("day");
        // start time values
        const oneWeekStartTime = (0, moment_1.default)(oneWeekBefore).subtract(1, "days").startOf("day");
        const twoWeekStartTime = (0, moment_1.default)(twoWeekBefore).subtract(1, "days").startOf("day");
        const oneMonthStartTime = (0, moment_1.default)(oneMonthBefore).subtract(1, "days").startOf("day");
        const oneDayBeforeGoals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: oneDay,
            dueOnDate: {
                $gte: currentTime.startOf("day").toDate(),
                $lt: oneDayBefore.toDate(),
            },
        });
        if ((0, lodash_1.size)(oneDayBeforeGoals) > 0) {
            yield sendGoalExpirationReminder(oneDayBeforeGoals);
        }
        // One Week Before Goals
        const oneWeekBeforeGoals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: oneWeek,
            dueOnDate: {
                $gte: oneWeekStartTime,
                $lt: oneWeekBefore.toDate(),
            },
        });
        if ((0, lodash_1.size)(oneWeekBeforeGoals) > 0) {
            yield sendGoalExpirationReminder(oneWeekBeforeGoals);
        }
        // Two Weeks Before Goals
        const twoWeekBeforeGoals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: twoWeek,
            dueOnDate: {
                $gte: twoWeekStartTime,
                $lt: twoWeekBefore.toDate(),
            },
        });
        if ((0, lodash_1.size)(twoWeekBeforeGoals) > 0) {
            yield sendGoalExpirationReminder(twoWeekBeforeGoals);
        }
        // One Month Before Goals
        const oneMonthBeforeGoals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: oneMonth,
            dueOnDate: {
                $gte: oneMonthStartTime,
                $lt: oneMonthBefore.toDate(),
            },
        });
        if ((0, lodash_1.size)(oneMonthBeforeGoals) > 0) {
            yield sendGoalExpirationReminder(oneMonthBeforeGoals);
        }
    }
    catch (error) {
        console.error("Goal Notifications Day Hours Before Error:", error);
    }
}));
// Schedule the cron job
router.get("/hour", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = (0, moment_1.default)();
        const tomorrow = (0, moment_1.default)().add(2, "days").startOf("day");
        const oneWeekBefore = (0, moment_1.default)().add(1, "weeks").startOf("day");
        const startTime = (0, moment_1.default)(tomorrow).subtract(1, "days").startOf("day");
        console.log('currentTime', startTime.startOf("day").toDate());
        console.log('tomorrow', oneWeekBefore.toDate());
        const goals = yield Goal_1.default.find({
            status: goal_1.GOAL_STATUS.INPROGRESS,
            notificationsReminder: true,
            reminderFrequency: twoHours,
            dueOnDate: {
                $gte: currentTime,
                $lte: tomorrow.toDate(),
            },
        });
        if ((0, lodash_1.size)(goals) > 0) {
            yield sendGoalExpirationReminder(goals);
        }
        res.status(200).json({ success: true, data: goals });
    }
    catch (error) {
        console.error("Goal Notifications Two Hours Before Error:", error);
        res.status(400).json({ success: false });
    }
}));
const sendGoalExpirationReminder = (goals) => __awaiter(void 0, void 0, void 0, function* () {
    goals.forEach((goal) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findById(goal.user).select("userName email isDeleted");
        const notification = {
            title: `${goal_1.GOAL_REMINDER}`,
            name: `${notificationsTypes_1.SOCKET_EVENT_TYPES.GOAL_NOTIFICATION}_${goal.user}`,
            message: `Hi ${user.userName}, just a heads up! Your goal deadline for ${goal.name} is nearing expiration, with only ${goal.reminderFrequency} left. Let's discuss key points to ensure success.`,
            from: goal.user,
            receivers: [goal.user],
            referenceId: goal._id
        };
        const notifications = new Notifications_1.default(notification);
        yield notifications.save();
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.GOAL_NOTIFICATION}_${goal.user}`, {
            isNotification: true,
            userIds: [goal === null || goal === void 0 ? void 0 : goal.user]
        });
    }));
});
exports.default = router;
process.stdin.resume();
//# sourceMappingURL=GoalNotifications.js.map