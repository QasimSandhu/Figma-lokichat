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
const User_1 = __importDefault(require("../models/User"));
const user_1 = require("../lib/constants/user");
const SuperUser_1 = __importDefault(require("../models/SuperUser"));
const mongoose_1 = __importDefault(require("mongoose"));
const StripeAccounts_1 = __importDefault(require("../classes/StripeAccounts"));
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const SocketIO_1 = require("../classes/SocketIO");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const sendGridEmail_1 = require("../lib/helpers/sendGridEmail");
const mailTypes_1 = require("../lib/constants/mailTypes");
const socket = new SocketIO_1.Socket();
class SuperUserService {
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { description, website, socialInfo } = body;
            const userTableData = yield User_1.default.findById(userId);
            const existingRequest = yield SuperUser_1.default.findOne({ user: userId });
            if ((existingRequest &&
                (existingRequest === null || existingRequest === void 0 ? void 0 : existingRequest.status) === user_1.SUPER_USER_STATUS.PENDING) ||
                (existingRequest === null || existingRequest === void 0 ? void 0 : existingRequest.status) === user_1.SUPER_USER_STATUS.APPROVED) {
                throw new Error(`Your request is already in ${existingRequest === null || existingRequest === void 0 ? void 0 : existingRequest.status}`);
            }
            else if (existingRequest &&
                (existingRequest === null || existingRequest === void 0 ? void 0 : existingRequest.status) === user_1.SUPER_USER_STATUS.REJECTED) {
                existingRequest.status = user_1.SUPER_USER_STATUS.PENDING;
                existingRequest.approvedBy = null;
                yield existingRequest.save();
                return existingRequest;
            }
            const superUser = new SuperUser_1.default({
                user: userId,
                status: user_1.SUPER_USER_STATUS.PENDING,
                description,
                website,
                socialInfo,
            });
            yield superUser.save();
            const notification = {
                title: 'Super User Request Submitted.',
                user: userId,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.SUPERUSER_REQUEST,
                message: `Your request for super user has been submitted.`,
                from: '65291a4b64a424c209e8f360',
                receivers: [userId]
            };
            const notifications = new Notifications_1.default(notification);
            yield notifications.save();
            socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.SUPERUSER_REQUEST, {
                isNotification: true,
                userIds: [userId]
            });
            yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.SUPER_USER_REQUEST_MAIL, { name: userTableData === null || userTableData === void 0 ? void 0 : userTableData.userName }, userTableData === null || userTableData === void 0 ? void 0 : userTableData.email);
            return superUser;
        });
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const superUsers = yield SuperUser_1.default.find({ user: userId });
            return superUsers;
        });
    }
    show(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const superUser = yield SuperUser_1.default.findOne({ user: userId });
            if (!superUser)
                throw new Error("no approved request found");
            return superUser;
        });
    }
    update(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { status, userToApprove } = body;
            const user = yield User_1.default.findOne({ _id: userId });
            // if (user.role !== USER_ROLES.SUPER_ADMIN) {
            //   throw new Error("You role is not super admin");
            // }
            if (status !== user_1.SUPER_USER_STATUS.APPROVED &&
                status !== user_1.SUPER_USER_STATUS.PENDING &&
                status !== user_1.SUPER_USER_STATUS.REJECTED) {
                throw new Error("invalid status value");
            }
            const sessions = yield mongoose_1.default.startSession();
            yield sessions.startTransaction();
            try {
                const updatedSuperUser = yield SuperUser_1.default.findOneAndUpdate({ user: userToApprove }, { approvedBy: userId, status }, { new: true });
                if (status == user_1.SUPER_USER_STATUS.APPROVED) {
                    const account = yield StripeAccounts_1.default.createConnectAccount();
                    yield User_1.default.findByIdAndUpdate(userToApprove, {
                        $set: {
                            stripeConnectAccountId: account.id
                        }
                    });
                }
                if (!updatedSuperUser)
                    throw new Error("No request found against this user");
                yield User_1.default.findOneAndUpdate({ _id: userToApprove }, { role: status === user_1.SUPER_USER_STATUS.APPROVED ? user_1.USER_ROLES.SUERP_USER : user_1.USER_ROLES.USER }, { new: true });
                const notification = {
                    title: 'Super User Request Approved.',
                    user: userId,
                    name: notificationsTypes_1.SOCKET_EVENT_TYPES.SUPERUSER_APPROVED,
                    message: `Your request for super user has been approved.`,
                    from: userId,
                    receivers: [userToApprove],
                    profileUrl: (_a = user === null || user === void 0 ? void 0 : user.profileUrl) !== null && _a !== void 0 ? _a : null
                };
                const notifications = new Notifications_1.default(notification);
                yield notifications.save();
                socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.SUPERUSER_APPROVED, {
                    isNotification: true,
                    userIds: [userToApprove]
                });
                const toUser = yield (User_1.default === null || User_1.default === void 0 ? void 0 : User_1.default.findById(userToApprove));
                yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.SUPER_USER_APPROVED_MAIL, { name: toUser === null || toUser === void 0 ? void 0 : toUser.userName }, toUser === null || toUser === void 0 ? void 0 : toUser.email);
                yield sessions.commitTransaction();
                return updatedSuperUser;
            }
            catch (err) {
                yield sessions.abortTransaction();
                throw new Error(err.message || "server error");
            }
            finally {
                yield sessions.endSession();
            }
        });
    }
}
exports.default = new SuperUserService();
//# sourceMappingURL=SuperUserService.js.map