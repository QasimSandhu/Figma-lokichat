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
const Debate_1 = __importDefault(require("../models/Debate"));
const LLama2Model_1 = __importDefault(require("../classes/LLama2Model"));
const filterTypes_1 = require("../lib/constants/filterTypes");
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const SocketIO_1 = require("../classes/SocketIO");
const textFormatting_1 = require("../lib/helpers/textFormatting");
const debate_1 = require("../lib/constants/debate");
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("../lib/constants/routes");
const Subscription_1 = __importDefault(require("../models/Subscription"));
const User_1 = __importDefault(require("../models/User"));
const subscrptions_1 = require("../lib/helpers/subscrptions");
const socket = new SocketIO_1.Socket();
class DebateService {
    store(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { title, invitedUsers } = body;
            if ((0, lodash_1.size)(invitedUsers) === 0)
                throw new Error("No user is invited, so, you cant start debate");
            const userIdSet = new Set();
            for (const userId of invitedUsers) {
                if (userIdSet.has(userId)) {
                    // Duplicate user ID found, throw an exception
                    throw new Error(`Duplicate user ID found: ${userId}`);
                }
                userIdSet.add(userId);
            }
            const invitedUsersArray = invitedUsers.map((user) => ({ user }));
            const debate = new Debate_1.default({
                title,
                user: userId,
                invitedUsers: invitedUsersArray,
            });
            yield debate.save();
            yield debate.populate({
                path: "user invitedUsers.user messages.sender",
                select: "email userName profileUrl",
            });
            const notification = {
                title: `${debate_1.DEBATE_INVITATION}`,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
                message: `You are invited in ${debate.title} debate.`,
                item: debate._id,
                from: userId,
                receivers: invitedUsers,
                pagePath: routes_1.ROUTES.DEBATE,
                pageId: debate._id,
                profileUrl: (_b = (_a = debate.user) === null || _a === void 0 ? void 0 : _a.profileUrl) !== null && _b !== void 0 ? _b : null
            };
            for (let i = 0; i < (0, lodash_1.size)(invitedUsers); i++) {
                socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${invitedUsers[i]}`, { message: debate.messages[debate.messages.length - 1] });
            }
            const notifications = new Notifications_1.default(notification);
            yield notifications.save();
            socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
                isNotification: true,
                userIds: [...invitedUsers]
            });
            return debate;
        });
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, userId } = req;
            const { filter, search, page, resPerPage } = query;
            const searchFilter = search
                ? { title: { $regex: new RegExp(search, "i") } }
                : {};
            let dateFilter = {};
            if (filter === filterTypes_1.SEARCH_FILTER.TODAY) {
                dateFilter = {
                    createdAt: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                };
            }
            else if (filter === filterTypes_1.SEARCH_FILTER.LAST_WEEK) {
                dateFilter = {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                        $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                };
            }
            else if (filter === filterTypes_1.SEARCH_FILTER.PREVIOUS_MONTH) {
                dateFilter = {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                        $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                };
            }
            else if (filter === filterTypes_1.SEARCH_FILTER.OLDER) {
                dateFilter = {
                    createdAt: {
                        $lt: new Date(new Date().setDate(new Date().getDate() - 30)),
                    },
                };
            }
            const [debates, totalDebates] = yield Promise.all([
                Debate_1.default.aggregate([
                    {
                        $match: Object.assign(Object.assign({ $or: [
                                { user: new mongoose_1.default.Types.ObjectId(userId) },
                                { 'invitedUsers.user': { $in: [new mongoose_1.default.Types.ObjectId(userId)] } },
                                { 'leavedDebateUsers.user': { $in: [new mongoose_1.default.Types.ObjectId(userId)] } },
                                { 'removedDebateUsers.user': { $in: [new mongoose_1.default.Types.ObjectId(userId)] } }
                            ] }, searchFilter), dateFilter),
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            unreadMessages: {
                                $size: {
                                    $filter: {
                                        input: "$messages",
                                        as: "message",
                                        cond: {
                                            $not: {
                                                $in: [new mongoose_1.default.Types.ObjectId(userId), { $ifNull: ["$$message.readBy", []] }],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    { $skip: resPerPage * (page - 1) },
                    { $limit: Number(resPerPage) },
                ]),
                Debate_1.default.countDocuments(Object.assign(Object.assign({ $or: [
                        { user: userId },
                        { 'invitedUsers.user': { $in: [userId] } },
                        { 'invitedUsers.user': { $in: [new mongoose_1.default.Types.ObjectId(userId)] } },
                        { 'leavedDebateUsers.user': { $in: [new mongoose_1.default.Types.ObjectId(userId)] } },
                        { 'removedDebateUsers.user': { $in: [new mongoose_1.default.Types.ObjectId(userId)] } }
                    ] }, searchFilter), dateFilter)),
            ]);
            const availableRecords = yield Debate_1.default.countDocuments({ user: userId });
            return {
                debates,
                currentPage: Number(page),
                pages: Math.ceil(totalDebates / resPerPage),
                totalDebates: Number(totalDebates),
                perPage: Number(resPerPage),
                isAvailableRecords: availableRecords > 0 ? true : false
            };
        });
    }
    show(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, params } = req;
            const { debateId } = params;
            const debate = yield Debate_1.default.findOne({
                _id: debateId,
                $or: [
                    { user: userId },
                    { 'invitedUsers.user': userId },
                    { 'leavedDebateUsers.user': userId },
                    { 'removedDebateUsers.user': userId }
                ]
            });
            if (!debate)
                throw new Error("No debate found with this id.");
            let createdAt;
            if (debate.leavedDebateUsers.some(user => user.user == userId)) {
                const userObj = debate.leavedDebateUsers.find(user => user.user == userId);
                createdAt = userObj.createdAt;
            }
            else if (debate.removedDebateUsers.some(user => user.user === userId)) {
                const userObj = debate.removedDebateUsers.find(user => user.user == userId);
                createdAt = userObj.createdAt;
            }
            if (createdAt) {
                debate.messages = debate.messages.filter(msg => msg.createdAt < createdAt);
            }
            yield debate
                .populate({
                path: "user invitedUsers.user messages.sender",
                select: "email userName profileUrl",
            });
            if ((0, lodash_1.size)(debate.invitedUsers) > 1) {
                debate.invitedUsers = (_a = debate.invitedUsers) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (b === null || b === void 0 ? void 0 : b.createdAt) - (a === null || a === void 0 ? void 0 : a.createdAt));
            }
            return debate;
        });
    }
    update(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { message, debateId, mentionedUsers, isBotMentioned, responseTo } = body;
            const debate = yield Debate_1.default.findById(debateId);
            if (!debate)
                throw new Error("no debate found with this Id");
            const updatedMessage = {
                sender: userId,
                message: message,
                mentionedUsers: mentionedUsers || [],
                isBotMentioned: isBotMentioned || false,
                responseTo: responseTo || null,
                readBy: [userId]
            };
            debate.messages.push(updatedMessage);
            if (isBotMentioned) {
                const debateMsg = (0, textFormatting_1.getPlainTextFromHTML)(message);
                const user = yield User_1.default.findById(userId);
                const subscriptions = yield Subscription_1.default.find();
                yield (0, subscrptions_1.verifyRemainingWords)(user, subscriptions);
                const botResponse = yield LLama2Model_1.default.fetchAnswer([], debateMsg);
                yield (0, subscrptions_1.updateUserWordsCounter)(user, botResponse, subscriptions);
                const lastMessageIdx = (0, lodash_1.size)(debate.messages);
                const botMessage = {
                    sender: userId,
                    message: botResponse,
                    mentionedUsers: mentionedUsers || [],
                    isBotResponse: true,
                    responseTo: (_a = debate.messages[lastMessageIdx - 1]) === null || _a === void 0 ? void 0 : _a._id,
                    readBy: [userId],
                };
                debate.messages.push(botMessage);
            }
            yield debate.save();
            const invitedUserIds = debate.invitedUsers.map(el => el.user);
            let notificationReceivers = [...invitedUserIds, debate.user];
            yield debate.populate({
                path: "messages.sender",
                select: "email userName profileUrl",
            });
            pushNewMessageNotification(debate, notificationReceivers, debate_1.MESSAGE_TYPES.DEBATE_NOTIFICATION);
            return debate;
        });
    }
    updateMessages(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, body } = req;
                const { debateId, messageId, message, mentionedUsers, isBotMentioned } = body;
                if (!debateId)
                    throw new Error("debateId is required");
                const debate = yield Debate_1.default.findById(debateId);
                if (!debate)
                    throw new Error("No debate found with this id.");
                let updatedDebateMsg;
                let newDebateMsg;
                const updatedMessage = {
                    message: message,
                    mentionedUsers: mentionedUsers || [],
                    isBotMentioned: isBotMentioned,
                };
                const invitedUserIds = debate.invitedUsers.map(el => el.user);
                let notificationReceivers = [...invitedUserIds, debate.user];
                if (isBotMentioned) {
                    const user = yield User_1.default.findById(userId);
                    const subscriptions = yield Subscription_1.default.find();
                    yield (0, subscrptions_1.verifyRemainingWords)(user, subscriptions);
                    const botResponse = yield LLama2Model_1.default.fetchAnswer([], message);
                    yield (0, subscrptions_1.updateUserWordsCounter)(user, botResponse, subscriptions);
                    updatedMessage.response = botResponse;
                    updatedMessage.isBotResponse = true;
                    const indexToUpdate = debate.messages.findIndex((msg) => msg.responseTo == messageId);
                    if (indexToUpdate !== -1) {
                        debate.messages[indexToUpdate].message = updatedMessage.response;
                        debate.messages[indexToUpdate].mentionedUsers = updatedMessage.mentionedUsers;
                        debate.messages[indexToUpdate].isBotMentioned = true;
                        const updatedDebate = yield Debate_1.default.findOneAndUpdate({ _id: debateId, 'messages.responseTo': messageId }, { $set: {
                                "messages.$.message": updatedMessage.response,
                                "messages.$.mentionedUsers": updatedMessage.mentionedUsers,
                                "messages.$.isBotMentioned": true,
                            } }, { new: true }).select('messages');
                        yield updatedDebate.populate({
                            path: "messages.sender",
                            select: "email userName profileUrl",
                        });
                        updatedDebateMsg = updatedDebate.messages[indexToUpdate];
                    }
                    else {
                        const updatedDebate = yield Debate_1.default.findOneAndUpdate({ _id: debateId }, {
                            $push: {
                                messages: {
                                    responseTo: messageId,
                                    message: updatedMessage.response,
                                    mentionedUsers: updatedMessage.mentionedUsers,
                                    isBotResponse: true,
                                    sender: userId,
                                }
                            }
                        }, { new: true }).select('messages');
                        yield updatedDebate.populate({
                            path: "messages.sender",
                            select: "email userName profileUrl",
                        });
                        newDebateMsg = updatedDebate.messages[updatedDebate.messages.length - 1];
                    }
                }
                const indexToUpdate = debate.messages.findIndex((msg) => msg._id == messageId);
                const updatedDebateObj = yield Debate_1.default.findOneAndUpdate({
                    _id: debateId, messages: { $elemMatch: { _id: messageId } }
                }, {
                    $set: {
                        "messages.$.message": updatedMessage.message,
                        "messages.$.mentionedUsers": updatedMessage.mentionedUsers,
                        "messages.$.isBotMentioned": updatedMessage.isBotMentioned,
                    }
                }, { new: true }).select('messages');
                yield updatedDebateObj.populate({
                    path: "messages.sender",
                    select: "email userName profileUrl",
                });
                if (indexToUpdate !== -1) {
                    // pushUpdateMessageNotification(debate._id, updatedDebateObj.messages[indexToUpdate], notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
                    pushUpdateMsgIntoBotMsgNotification(debate._id, updatedDebateObj.messages[indexToUpdate], notificationReceivers, debate_1.MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
                }
                if (!(0, lodash_1.isEmpty)(updatedDebateMsg)) {
                    // pushUpdateMessageNotification(debate._id, updatedDebateMsg, notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
                    pushUpdateMsgIntoBotMsgNotification(debate._id, updatedDebateMsg, notificationReceivers, debate_1.MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
                }
                if (!(0, lodash_1.isEmpty)(newDebateMsg)) {
                    pushUpdateMsgIntoBotMsgNotification(debate._id, newDebateMsg, notificationReceivers, debate_1.MESSAGE_TYPES.CONVERT_MSG_TO_BOT_MSG_RESPONSE);
                }
                return updatedDebateObj;
            }
            catch (err) {
                console.log('err', err);
                // await session.abortTransaction();
                throw new Error((_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "Error while saving debate");
            }
        });
    }
    updateBotMessages(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { debateId, messageId, responseTo } = body;
            if (!debateId)
                throw new Error("debateId is required");
            const debate = yield Debate_1.default.findById(debateId);
            if (!debate)
                throw new Error("No debate found with this id.");
            const debateMessageObj = debate.messages.find((msg) => msg._id == responseTo);
            if (!debateMessageObj)
                throw new Error("No prompt found with respective bot response");
            const debateMsg = (0, textFormatting_1.getPlainTextFromHTML)(debateMessageObj.message);
            const user = yield User_1.default.findById(userId);
            const subscriptions = yield Subscription_1.default.find();
            yield (0, subscrptions_1.verifyRemainingWords)(user, subscriptions);
            const botResponse = yield LLama2Model_1.default.fetchAnswer([], debateMsg);
            yield (0, subscrptions_1.updateUserWordsCounter)(user, botResponse, subscriptions);
            const indexToUpdate = debate.messages.findIndex((msg) => msg._id == messageId);
            if (indexToUpdate !== -1) {
                debate.messages[indexToUpdate].message = botResponse;
                yield debate.save();
            }
            const invitedUserIds = debate.invitedUsers.map(el => el.user);
            let notificationReceivers = [...invitedUserIds, debate.user];
            yield debate.populate({
                path: "messages.sender",
                select: "email userName profileUrl",
            });
            // pushUpdateMessageNotification(debateId, debate.messages[indexToUpdate], notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
            pushUpdateMsgIntoBotMsgNotification(debateId, debate.messages[indexToUpdate], notificationReceivers, debate_1.MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
            return debate;
        });
    }
    updateInvitedUsers(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { debateId, invitedUser } = body;
            if ((0, lodash_1.size)(invitedUser) === 0)
                throw new Error("no invited user is included");
            const debate = yield Debate_1.default.findById(debateId).populate({
                path: "user",
                select: "email userName profileUrl",
            });
            if (!debate)
                throw new Error("No debate found with this id.");
            if (((_a = debate.user) === null || _a === void 0 ? void 0 : _a._id) != userId)
                throw new Error("Only debate admin can invite more users");
            // Remove the invited user from leaveDebateUserIds if present
            const isDuplicateUser = debate.invitedUsers.findIndex((el) => el.user == invitedUser);
            if (isDuplicateUser !== -1) {
                throw new Error(`Duplicate user ID found: ${invitedUser}`);
            }
            const leaveDebateIndex = debate.leavedDebateUsers.findIndex((el) => el.user == invitedUser);
            const removedDebateIndex = debate.removedDebateUsers.findIndex((el) => el.user == invitedUser);
            if (leaveDebateIndex !== -1) {
                debate.leavedDebateUsers.splice(leaveDebateIndex, 1);
            }
            if (removedDebateIndex !== -1) {
                debate.removedDebateUsers.splice(leaveDebateIndex, 1);
            }
            debate.invitedUsers.push({ user: invitedUser });
            const invitedUserIds = debate.invitedUsers.map(el => el.user);
            const notificationReceivers = [...invitedUserIds];
            const notification = {
                title: `${debate_1.DEBATE_INVITATION}`,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
                message: `You are invited in ${debate.title} debate.`,
                item: debate._id,
                from: userId,
                receivers: [invitedUser],
                pagePath: routes_1.ROUTES.DEBATE,
                pageId: debate._id,
                profileUrl: (_c = (_b = debate.user) === null || _b === void 0 ? void 0 : _b.profileUrl) !== null && _c !== void 0 ? _c : null
            };
            socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${invitedUser}`, { message: debate.messages[debate.messages.length - 1] });
            const notifications = new Notifications_1.default(notification);
            yield notifications.save();
            socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
                isNotification: true,
                userIds: [invitedUser]
            });
            yield debate.save();
            yield debate.populate({
                path: "invitedUsers.user",
                select: "email userName profileUrl",
            });
            if ((0, lodash_1.size)(debate.invitedUsers) > 1) {
                debate.invitedUsers = (_d = debate.invitedUsers) === null || _d === void 0 ? void 0 : _d.sort((a, b) => (b === null || b === void 0 ? void 0 : b.createdAt) - (a === null || a === void 0 ? void 0 : a.createdAt));
            }
            const populatedInvitedUsers = debate.invitedUsers.map(el => el.user);
            updateDebateInvitedUserFromDebate(debateId, populatedInvitedUsers, notificationReceivers);
            return debate;
        });
    }
    removeUserFromDebate(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { debateId, userToRemove } = body;
            const debate = yield Debate_1.default.findById(debateId).populate({
                path: "user",
                select: "email userName profileUrl",
            });
            if (!debate)
                throw new Error("No debate found with this id.");
            if (debate.user._id != userId)
                throw new Error("Only debate admin can remove users");
            // Remove the invited user from leaveDebateUserIds if present
            const removedUserIdx = debate.invitedUsers.findIndex((usr) => usr.user == userToRemove);
            if (removedUserIdx !== -1) {
                debate.invitedUsers.splice(removedUserIdx, 1);
            }
            const invitedUserIds = debate.invitedUsers.map(el => el.user);
            const notificationReceivers = [...invitedUserIds, userToRemove];
            debate.removedDebateUsers.push({ user: userToRemove });
            const notification = {
                title: `${debate_1.DEBATE_INVITATION}`,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
                message: `You are removed from ${debate.title} debate.`,
                item: debate._id,
                from: userId,
                receivers: [userToRemove],
                pagePath: routes_1.ROUTES.DEBATE,
                pageId: debate._id,
                profileUrl: (_a = debate.user.profileUrl) !== null && _a !== void 0 ? _a : null
            };
            socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${userToRemove}`, { message: debate.messages[debate.messages.length - 1] });
            const notifications = new Notifications_1.default(notification);
            yield notifications.save();
            socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
                isNotification: true,
                userIds: [userToRemove]
            });
            yield debate.save();
            yield debate.populate({
                path: "invitedUsers.user",
                select: "email userName profileUrl",
            });
            if ((0, lodash_1.size)(debate.invitedUsers) > 1) {
                debate.invitedUsers = (_b = debate.invitedUsers) === null || _b === void 0 ? void 0 : _b.sort((a, b) => (b === null || b === void 0 ? void 0 : b.createdAt) - (a === null || a === void 0 ? void 0 : a.createdAt));
            }
            const updatedInvitedUsers = debate.invitedUsers.map(el => el.user);
            updateDebateInvitedUserFromDebate(debateId, updatedInvitedUsers, notificationReceivers);
            return debate;
        });
    }
    leaveDebate(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { debateId } = body;
            const debate = yield Debate_1.default.findById(debateId).populate({
                path: 'invitedUsers.user',
                select: 'email userName profileUrl'
            });
            if (!debate)
                throw new Error('No debate found with this id');
            if (userId == debate.user)
                throw new Error('You are debate admin, you cant leave this debate');
            const leavedUserIdx = debate.invitedUsers.findIndex(el => el.user._id == userId);
            const userWhoLeaveDebate = debate.invitedUsers.find((usr) => { var _a; return ((_a = usr === null || usr === void 0 ? void 0 : usr.user) === null || _a === void 0 ? void 0 : _a._id) == userId; });
            if (leavedUserIdx !== -1) {
                debate.invitedUsers.splice(leavedUserIdx, 1);
            }
            const debateInvitedUsers = debate.invitedUsers.map(el => { var _a; return (_a = el.user) === null || _a === void 0 ? void 0 : _a._id; });
            const notificationReceivers = [...debateInvitedUsers, debate.user];
            debate.leavedDebateUsers.push({ user: userId });
            const notificationUsers = [...debateInvitedUsers, debate.user];
            yield debate.save();
            yield debate.populate({
                path: "user invitedUsers.user messages.sender",
                select: "email userName profileUrl",
            });
            if ((0, lodash_1.size)(debate.invitedUsers) > 1) {
                debate.invitedUsers = (_a = debate.invitedUsers) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (b === null || b === void 0 ? void 0 : b.createdAt) - (a === null || a === void 0 ? void 0 : a.createdAt));
            }
            const populatedInvitedUsers = debate.invitedUsers.map(el => el.user);
            updateDebateInvitedUserFromDebate(debateId, populatedInvitedUsers, notificationReceivers);
            for (let i = 0; i < (0, lodash_1.size)(notificationUsers); i++) {
                socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationUsers[i]}`, { message: debate.messages[debate.messages.length - 1] });
            }
            const notification = {
                title: `${debate_1.DEBATE_LEAVE}`,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
                message: `${(_b = userWhoLeaveDebate === null || userWhoLeaveDebate === void 0 ? void 0 : userWhoLeaveDebate.user) === null || _b === void 0 ? void 0 : _b.userName} leave ${debate.title} debate.`,
                from: userId,
                item: debate._id,
                receivers: notificationUsers,
                pagePath: routes_1.ROUTES.DEBATE,
                pageId: debate._id,
                profileUrl: (_d = (_c = userWhoLeaveDebate === null || userWhoLeaveDebate === void 0 ? void 0 : userWhoLeaveDebate.user) === null || _c === void 0 ? void 0 : _c.profileUrl) !== null && _d !== void 0 ? _d : null
            };
            const notifications = new Notifications_1.default(notification);
            yield notifications.save();
            socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
                isNotification: true,
                userIds: notificationUsers
            });
            return debate;
        });
    }
    markAsReadDebate(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { debateId } = body;
            const debate = yield Debate_1.default.findById(debateId);
            if (!debate)
                throw new Error('No debate found with this id');
            (_a = debate.messages) === null || _a === void 0 ? void 0 : _a.forEach((message) => {
                // Check if the user ID is not already in the readBy array
                if (!message.readBy.includes(userId)) {
                    // Add the user ID to the readBy array
                    message.readBy.push(userId);
                }
            });
            yield debate.save();
            return debate;
        });
    }
    deleteMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { messageId, debateId } = body;
            const result = yield Debate_1.default.updateOne({ _id: debateId, user: userId }, {
                $pull: {
                    messages: {
                        $or: [
                            { messageId: messageId },
                            { responseTo: messageId }
                        ]
                    }
                }
            });
            const chat = yield Debate_1.default.findById(debateId);
            if ((0, lodash_1.size)(chat.messages) === 0) {
                yield Debate_1.default.findByIdAndDelete(debateId);
            }
            return result;
        });
    }
    updateMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { messageId, chatId, message, response } = body;
            yield Debate_1.default.findOneAndUpdate({ _id: chatId, "messages.messageId": messageId }, { $set: { "messages.$.content": message } }, { new: true });
            yield Debate_1.default.findOneAndUpdate({ _id: chatId, "messages.responseTo": messageId }, { $set: { "messages.$.content": response } }, { new: true });
            return "Chat reverted successfully";
        });
    }
}
const pushNewMessageNotification = (debate, notificationReceivers, type) => {
    for (let i = 0; i < (0, lodash_1.size)(notificationReceivers); i++) {
        const secondLastMsg = debate.messages[debate.messages.length - 2];
        const lastMsg = debate.messages[debate.messages.length - 1];
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`, { message: secondLastMsg, debateId: debate._id, type });
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`, { message: lastMsg, debateId: debate._id, type });
    }
};
const pushUpdateMsgIntoBotMsgNotification = (debateId, message, notificationReceivers, type) => {
    for (let i = 0; i < (0, lodash_1.size)(notificationReceivers); i++) {
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`, { message: message, debateId: debateId, type });
    }
};
const updateDebateInvitedUserFromDebate = (debateId, invitedUsers, notificationReceivers) => {
    for (let i = 0; i < (0, lodash_1.size)(notificationReceivers); i++) {
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.UPDATE_DEBATE_INVITED_USERS}_${notificationReceivers[i]}`, { invitedUsers: invitedUsers, debateId: debateId });
    }
};
exports.default = new DebateService();
//# sourceMappingURL=DebateService.js.map