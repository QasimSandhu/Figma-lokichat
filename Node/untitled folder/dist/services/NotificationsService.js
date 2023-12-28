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
const lodash_1 = require("lodash");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const User_1 = __importDefault(require("../models/User"));
const sendGridEmail_1 = require("../lib/helpers/sendGridEmail");
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const SocketIO_1 = require("../classes/SocketIO");
const socket = new SocketIO_1.Socket();
class GoalsService {
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const notifications = yield Notifications_1.default.find({ receivers: { $in: userId } }).sort({ _id: -1 }).limit(20).populate({
                    path: 'from',
                    select: 'email profileUrl userName'
                });
                const newNot = notifications.map((i) => {
                    var _a, _b;
                    const isRead = (_b = (_a = i._doc) === null || _a === void 0 ? void 0 : _a.readBy) === null || _b === void 0 ? void 0 : _b.find((it) => it == userId);
                    return Object.assign(Object.assign({}, i === null || i === void 0 ? void 0 : i._doc), { isRead: isRead ? true : false });
                });
                return newNot;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    read(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { id } = req.body;
            const notification = yield Notifications_1.default.findByIdAndUpdate(id, { $addToSet: { readBy: userId } });
            return notification;
        });
    }
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { message, from, receivers, readBy } = body;
            const goal = new Notifications_1.default({
                user: userId,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.GOAL_NOTIFICATION,
                message,
                from,
                receivers,
                readBy: readBy || [],
            });
            yield goal.save();
            socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.GOAL_NOTIFICATION, {
                isNotification: true,
                userIds: [userId]
            });
            return goal;
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { notificationsList } = body;
            if (notificationsList === false) {
                return yield User_1.default.findByIdAndUpdate(userId, { notificationsList: false }, { new: true });
            }
            else if (notificationsList === true) {
                return yield User_1.default.findByIdAndUpdate(userId, { notificationsList: true }, { new: true });
            }
            else if (Array.isArray(notificationsList) &&
                (0, lodash_1.size)(notificationsList) > 0) {
                return yield User_1.default.findByIdAndUpdate(userId, { notificationsList: notificationsList }, { new: true });
            }
            else
                throw new Error("invalid user notifications list");
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params } = req;
            const { notificationId } = params;
            return "";
        });
    }
    sendMail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, data, to } = req.body;
                yield (0, sendGridEmail_1.sendMailtoUser)(type, data, to);
                return `Mail sent to ${to} on ${new Date()}`;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new GoalsService();
//# sourceMappingURL=NotificationsService.js.map