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
const Chat_1 = __importDefault(require("../models/Chat"));
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = require("lodash");
const ChatList_1 = __importDefault(require("../models/ChatList"));
const chats_1 = require("../lib/constants/chats");
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const filterTypes_1 = require("../lib/constants/filterTypes");
class ChatService {
    show(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, userId } = req;
            const { dateSpan, search, chatListId } = query;
            if ((0, lodash_1.isEmpty)(chatListId))
                throw new Error("chatList ID is required");
            let chatLists;
            chatLists = yield ChatList_1.default.findOne({ _id: chatListId, user: userId });
            if (!chatLists)
                throw new Error("Chat list does not exists");
            const match = {
                user: new mongoose_1.default.Types.ObjectId(userId),
                chatList: new mongoose_1.default.Types.ObjectId(chatLists._id),
                "messages.0": { $exists: true, $ne: [] },
            };
            if ((0, lodash_1.size)(search) > 0) {
                match["messages.0.content"] = { $regex: search, $options: "i" };
                match["messages.sender"] = chats_1.CHAT_ROLES.USER;
            }
            const project = { messages: 1, createdAt: 1, updatedAt: 1 };
            const today = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                        },
                    },
                },
                { $project: project },
                { $sort: { _id: -1 } },
            ];
            const lastWeek = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                            $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
                        },
                    },
                },
                { $project: project },
                { $sort: { _id: -1 } },
            ];
            const last30Days = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                            $lt: new Date(new Date().setDate(new Date().getDate() - 7)),
                        },
                    },
                },
                { $project: project },
                { $sort: { _id: -1 } },
            ];
            const older = [
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: {
                                    $and: [
                                        {
                                            $ne: [
                                                "$createdAt",
                                                {
                                                    $dateToString: { format: "%Y-%m-%d", date: new Date() },
                                                },
                                            ],
                                        },
                                        {
                                            $lt: [
                                                "$createdAt",
                                                {
                                                    $dateToString: {
                                                        format: "%Y-%m-%d",
                                                        date: {
                                                            $subtract: [new Date(), 30 * 24 * 60 * 60 * 1000],
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                then: true,
                                else: false,
                            },
                        },
                    },
                },
                { $project: project },
                { $sort: { _id: -1 } },
            ];
            const facet = {};
            if (dateSpan === chats_1.DATE_SPAN.TODAY) {
                facet.today = today;
            }
            else if (dateSpan === chats_1.DATE_SPAN.LASTWEEK) {
                facet.lastWeek = lastWeek;
            }
            else if (dateSpan === chats_1.DATE_SPAN.LAST30DAYS) {
                facet.last30Days = last30Days;
            }
            else if (dateSpan === chats_1.DATE_SPAN.OLDER) {
                facet.older = older;
            }
            else {
                facet.today = today;
                facet.lastWeek = lastWeek;
                facet.last30Days = last30Days;
                facet.older = older;
            }
            const pipeline = [
                { $match: match },
                {
                    $project: {
                        messages: { $slice: ["$messages", 2] },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                { $facet: facet },
            ];
            const chats = yield Chat_1.default.aggregate(pipeline);
            const chatData = chats[0];
            chatData[chats_1.DATE_SPAN.TODAY] = (chatData === null || chatData === void 0 ? void 0 : chatData.today) || [];
            chatData[chats_1.DATE_SPAN.LASTWEEK] = (chatData === null || chatData === void 0 ? void 0 : chatData.lastWeek) || [];
            chatData[chats_1.DATE_SPAN.LAST30DAYS] = (chatData === null || chatData === void 0 ? void 0 : chatData.last30Days) || [];
            chatData[chats_1.DATE_SPAN.OLDER] = (chatData === null || chatData === void 0 ? void 0 : chatData.older) || [];
            chatLists.chats = chatData;
            const returnedObject = {
                id: chatLists._id,
                user: chatLists.user,
                title: chatLists.title,
                color: chatLists.color,
                createdAt: chatLists.createdAt,
                chatData: chatData,
            };
            return Object.assign({}, ObjectDestructurer_1.default.distruct(returnedObject));
        });
    }
    showByPagination(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, userId } = req;
            const { filter, search, chatListId, page, resPerPage } = query;
            const searchFilter = search
                ? {
                    "messages.content": {
                        $regex: new RegExp(search, "i"), // 'i' for case-insensitive search
                    },
                }
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
            const [chats, totalChats] = yield Promise.all([
                Chat_1.default.find(Object.assign(Object.assign({ chatList: chatListId, user: userId }, searchFilter), dateFilter))
                    .sort({ _id: -1 })
                    .skip(resPerPage * (page - 1))
                    .limit(resPerPage)
                    .select({ messages: { $slice: 2 }, chatList: 1, createdAt: 1, updatedAt: 1 }),
                Chat_1.default.countDocuments(Object.assign(Object.assign({ chatList: chatListId, user: userId }, searchFilter), dateFilter)),
            ]);
            return {
                chats,
                currentPage: Number(page),
                pages: Math.ceil(totalChats / resPerPage),
                totalChats: Number(totalChats),
                perPage: Number(resPerPage),
            };
        });
    }
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { title, color } = body;
            const chatList = new ChatList_1.default({
                title,
                color,
                user: userId,
            });
            yield chatList.save();
            return chatList;
        });
    }
    index(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const pipeline = [
                {
                    $match: { user: new mongoose_1.default.Types.ObjectId(userId) },
                },
                {
                    $project: {
                        title: 1,
                        color: 1,
                        createdAt: 1,
                    },
                },
                { $sort: { _id: -1 } },
            ];
            const chatLists = yield ChatList_1.default.aggregate(pipeline);
            for (let i = 0; i < (0, lodash_1.size)(chatLists); i++) {
                const chatsCount = yield Chat_1.default.countDocuments({
                    user: userId,
                    chatList: (_a = chatLists[i]) === null || _a === void 0 ? void 0 : _a._id,
                    // $expr: { $gt: [{ $size: "$messages" }, 0] },
                });
                chatLists[i].chatsCount = chatsCount || 0;
            }
            return chatLists;
        });
    }
    export(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatListIds } = body;
            if ((0, lodash_1.size)(chatListIds) === 0)
                throw new Error("At least one chat id is required to export");
            const chats = yield Chat_1.default.find({
                chatList: { $in: chatListIds },
                user: userId,
                $expr: { $gt: [{ $size: "$messages" }, 0] },
            })
                .sort({ _id: -1 })
                .select("_id messages title createdAt");
            return chats;
        });
    }
}
exports.default = new ChatService();
//# sourceMappingURL=ChatListService.js.map