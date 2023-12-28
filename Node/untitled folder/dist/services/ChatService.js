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
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const uuid_1 = require("uuid");
const ChatBot_1 = __importDefault(require("../classes/ChatBot"));
const LLama2Model_1 = __importDefault(require("../classes/LLama2Model"));
const textFormatting_1 = require("../lib/helpers/textFormatting");
const User_1 = __importDefault(require("../models/User"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const mongoose_1 = __importDefault(require("mongoose"));
const chats_1 = require("../lib/constants/chats");
const lodash_1 = require("lodash");
const chats_2 = require("../lib/constants/chats");
const ChatList_1 = __importDefault(require("../models/ChatList"));
const filterTypes_1 = require("../lib/constants/filterTypes");
const retries = 3;
class ChatService {
    store(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let previousChatHistory = [];
            let { message, chatId, chatListId, chatModel } = body;
            let createdAt, chatCategoryId;
            let response, previousChat;
            if (chatId) {
                previousChat = yield Chat_1.default.findById(chatId).select("messages chatModel");
                previousChatHistory = (_a = previousChat === null || previousChat === void 0 ? void 0 : previousChat.messages) === null || _a === void 0 ? void 0 : _a.map((message) => {
                    return {
                        role: message.sender === chats_1.CHAT_ROLES.ASSISTANT ? "system" : message.sender,
                        content: message.content,
                    };
                });
            }
            if (chatId && (previousChat === null || previousChat === void 0 ? void 0 : previousChat.chatModel)) {
                if ((previousChat === null || previousChat === void 0 ? void 0 : previousChat.chatModel) === chats_1.CHAT_MODEL.CHAT_GPT_3) {
                    response = yield ChatBot_1.default.fetchAnswer(previousChatHistory, message, chats_1.CHAT_TYPE.CHAT, previousChat.chatModel);
                }
                else {
                    // here i have to implement stream for continuing chat
                    response = yield LLama2Model_1.default.fetchAnswer(previousChatHistory, message);
                }
            }
            else {
                response = yield LLama2Model_1.default.fetchAnswer(previousChatHistory, message);
            }
            // let formattedChat = await OpenAIBot.fetchAnswerDavinci(response);
            if ((0, textFormatting_1.getPlainTextFromHTML)(response) == message) {
                for (let i = 0; i < retries; i++) {
                    response = yield ChatBot_1.default.fetchAnswer(previousChatHistory, message);
                    if (response !== message)
                        break;
                }
            }
            const messageId = (0, uuid_1.v4)();
            const senderMessage = {
                messageId: messageId,
                sender: chats_1.CHAT_ROLES.USER,
                content: message,
            };
            const responseMessage = {
                messageId: (0, uuid_1.v4)(),
                sender: chats_1.CHAT_ROLES.ASSISTANT,
                content: response === null || response === void 0 ? void 0 : response.trim(),
                responseTo: messageId,
            };
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            const userWordsCount = (user === null || user === void 0 ? void 0 : user.wordsCount) || 0;
            const responseString = String(responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.content);
            const plainTextResponse = responseString === null || responseString === void 0 ? void 0 : responseString.replace(/<[^>]*>/g, "");
            const characterCount = plainTextResponse.replace(/ /g, "").length;
            // update words
            const wordCount = Math.ceil(characterCount / 7);
            if (user) {
                const subscriptions = yield Subscription_1.default.find();
                const findMatchingPlanTitle = (subscriptionId, subscriptions) => {
                    for (const subscription of subscriptions) {
                        const matchingPlan = subscription.plans.find((plan) => plan._id.toString() === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()));
                        if (matchingPlan)
                            return matchingPlan;
                    }
                    return null;
                };
                const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
                if (matchingPlanTitle) {
                    if (userWordsCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed)) {
                        throw new Error("limit exceed please buy more words");
                    }
                    if (userWordsCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) &&
                        (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) < userWordsCount + wordCount) {
                        const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount);
                        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
                    }
                }
            }
            if (!user.subscription) {
                let limit = 10000;
                if (userWordsCount >= limit) {
                    throw new Error("Free limit exceed please buy subscription");
                }
                if (userWordsCount < limit && limit < userWordsCount + wordCount) {
                    const remainingLimit = (limit - userWordsCount);
                    throw new Error(`Your remaining limit is ${remainingLimit} words.`);
                }
            }
            try {
                yield User_1.default.findByIdAndUpdate(userId, { $inc: { wordsCount: wordCount } });
            }
            catch (error) {
                console.error("Error updating wordsCount:", error);
            }
            if (!chatId) {
                const chat = new Chat_1.default({
                    user: userId,
                    messages: [senderMessage, responseMessage],
                    chatList: chatListId || null,
                    chatModel: chatModel,
                });
                yield chat.save();
                chatId = chat._id;
                createdAt = chat.createdAt;
                chatCategoryId = chat.chatList || null;
            }
            else {
                const chat = yield Chat_1.default.findOne({ _id: chatId, user: userId });
                chat.messages.push(senderMessage);
                chat.messages.push(responseMessage);
                yield chat.save();
                createdAt = chat.updatedAt;
                chatCategoryId = chat.chatList || null;
            }
            // return {
            //   message,
            //   response: response,
            //   messageId,
            //   chatListId: chatCategoryId,
            //   chatId,
            //   createdAt: createdAt,
            // };
            // Create New Message
            // {
            //   "chatId": "6583ce67dcc06955220887f3", // id to chatId
            //   "message": "OOP",
            //   "response": " **Greetings, Usama!**\n\nI understand you have a question for me. Without further ado, please let's dive into your inquiry.\n\n### Question\n\nWhat are some of the most important skills that a data scientist should possess?\n\n### Answer\n\nA data scientist must possess a variety of skills to excel in their field. Here are some of the most crucial ones:\n\n1. Programming Skills: A data scientist should be proficient in programming languages like Python, R, or SQL. They should also be familiar with data manipulation, processing, and analysis libraries such as NumPy, pandas, and matplotlib.\n2. Data Analysis and Interpretation: A data scientist should be able to analyze large datasets, identify patterns, and draw meaningful conclusions. They should also be able to communicate their findings effectively to stakeholders through visualizations and reports.\n3. Machine Learning: Machine learning is a significant aspect of data science. A data scientist should have a good understanding of supervised and unsupervised learning algorithms, including regression, classification, clustering, and neural networks.\n4. Business Acumen: A data scientist should have a basic understanding of business principles and be able to identify opportunities where data can drive decision-making processes. They should also be able to communicate with stakeholders about their needs and requirements.\n5. Communication Skills: A data scientist should be able to present complex technical concepts to non-technical people. They should have excellent written and verbal communication skills in English (or the local language).\n6. Curiosity and Creativity: A data scientist should be curious and creative, always looking for new ways to solve problems and improve processes. They should be open to exploring novel approaches and technologies.\n7. Ethics: A data scientist should be aware of ethical considerations related to data privacy, security, and bias. They should ensure that their work complies with relevant regulations and standards.\n8. Collaboration: A data scientist often works in teams, so they should be comfortable collaborating with others. They should also be able to work independently and manage their time effectively.\n9. Adaptability: The field of data science is constantly evolving, so a data scientist should be adaptable and willing to learn new techniques, tools, and technologies.\n10. Domain Knowledge: While not essential, having domain knowledge in a specific industry can be beneficial. For example, a healthcare data scientist should have some knowledge of medical terminology and practices.\n\nBy mastering these skills, a data scientist can extract valuable insights from data, help organizations make informed decisions, and advance their careers in this exciting and rapidly growing field.\n\nI hope this helps, Usama! Do you have any follow-up questions?",
            //   "messageId": "gdfdfd-dfdf-2323-sdsds", // REesponse Object ID 
            // "responseTo":"e0fc0638-0b59-4e41-9d45-220349ea6429",   // Msg Object ID 
            // "createdAt": "2023-12-21T05:34:31.764Z"
            // }
            return {
                chatId,
                message,
                messageId: responseMessage.messageId,
                responseTo: messageId,
                response: response,
                createdAt: createdAt,
                chatListId: chatCategoryId,
            };
        });
    }
    show(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId } = body;
            console.log('chat');
            const chats = yield Chat_1.default.findOne({ _id: chatId, user: userId }).populate({
                path: "chatList",
                select: "title color",
            });
            return Object.assign({}, ObjectDestructurer_1.default.distruct(chats));
        });
    }
    showDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId } = body;
            const chats = yield Chat_1.default.findOne({ _id: chatId, user: userId });
            return Object.assign({}, ObjectDestructurer_1.default.distruct(chats));
        });
    }
    storeChatList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatListId } = body;
            const existingChatList = yield ChatList_1.default.findOne({ _id: chatListId });
            if (!existingChatList)
                throw new Error("No Chat list found with this ID");
            const chat = new Chat_1.default({ user: userId, chatList: chatListId });
            yield chat.save();
            return Object.assign({}, ObjectDestructurer_1.default.distruct(chat));
        });
    }
    promptAdvisor(req) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            try {
                const chats = yield Chat_1.default.find({
                    user: new mongoose_1.default.Types.ObjectId(userId),
                })
                    .sort({ _id: -1 })
                    .limit(1);
                const lastIndex = ((_a = chats[0]) === null || _a === void 0 ? void 0 : _a.messages.length) - 1;
                const message = lastIndex >= 0 ? (_b = chats[0]) === null || _b === void 0 ? void 0 : _b.messages[lastIndex].content : 'hi welcome to lokichat.lokichat is the platform for students';
                if (message && typeof message == "string" && message.length > 0) {
                    const result = yield ChatBot_1.default.promptAdvisor(message);
                    const modifiedResult = result.map((line) => line.replace(/^\d+\.\s*/, ""));
                    const top10Questions = modifiedResult.slice(0, 10);
                    return top10Questions;
                }
                else {
                    throw new Error("No message found");
                }
            }
            catch (error) {
                console.log(error, "error");
                throw new Error((_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : error);
            }
        });
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, query } = req;
            const { dateSpan, search } = query;
            const match = {
                user: new mongoose_1.default.Types.ObjectId(userId),
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
            if (dateSpan === chats_2.DATE_SPAN.TODAY) {
                facet.today = today;
            }
            else if (dateSpan === chats_2.DATE_SPAN.LASTWEEK) {
                facet.lastWeek = lastWeek;
            }
            else if (dateSpan === chats_2.DATE_SPAN.LAST30DAYS) {
                facet.last30Days = last30Days;
            }
            else if (dateSpan === chats_2.DATE_SPAN.OLDER) {
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
            chatData[chats_2.DATE_SPAN.TODAY] = (chatData === null || chatData === void 0 ? void 0 : chatData.today) || [];
            chatData[chats_2.DATE_SPAN.LASTWEEK] = (chatData === null || chatData === void 0 ? void 0 : chatData.lastWeek) || [];
            chatData[chats_2.DATE_SPAN.LAST30DAYS] = (chatData === null || chatData === void 0 ? void 0 : chatData.last30Days) || [];
            chatData[chats_2.DATE_SPAN.OLDER] = (chatData === null || chatData === void 0 ? void 0 : chatData.older) || [];
            return chatData;
        });
    }
    indexByPagination(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, userId } = req;
            const { filter, search, page, resPerPage } = query;
            const searchFilter = search
                ? { "messages.content": { $regex: new RegExp(search, "i") } }
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
                Chat_1.default.find(Object.assign(Object.assign({ user: userId }, searchFilter), dateFilter))
                    .sort({ _id: -1 })
                    .skip(resPerPage * (page - 1))
                    .limit(resPerPage)
                    .select({ messages: { $slice: 2 }, chatList: 1, createdAt: 1, updatedAt: 1 }),
                Chat_1.default.countDocuments(Object.assign(Object.assign({ user: userId }, searchFilter), dateFilter)),
            ]);
            const availableChat = yield Chat_1.default.countDocuments({
                user: userId
            });
            return {
                chats,
                currentPage: Number(page),
                pages: Math.ceil(totalChats / resPerPage),
                totalChats: Number(totalChats),
                perPage: Number(resPerPage),
                isAvailableChat: availableChat > 0 ? true : false
            };
        });
    }
    update(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId, message, messageId } = body;
            const previousChatMessages = yield Chat_1.default.findById(chatId).select("messages chatModel");
            const previousChatHistory = (_a = previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.messages) === null || _a === void 0 ? void 0 : _a.map((message) => {
                return {
                    role: message.sender === "chatbot" ? "system" : message.sender,
                    content: message.content,
                };
            });
            let response;
            if (previousChatMessages.chatModel && previousChatMessages.chatModel !== chats_1.CHAT_MODEL.CHAT_GPT_3) {
                response = yield LLama2Model_1.default.fetchAnswer(previousChatHistory, message);
            }
            else {
                response = yield ChatBot_1.default.fetchAnswer(previousChatHistory, message, chats_1.CHAT_TYPE.CHAT, previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.chatModel);
            }
            if ((0, textFormatting_1.getPlainTextFromHTML)(response) == message) {
                for (let i = 0; i < retries; i++) {
                    response = yield ChatBot_1.default.fetchAnswer(previousChatHistory, message);
                    if (response !== message) {
                        break;
                    }
                }
            }
            // let formattedResponse = await OpenAIBot.fetchAnswerDavinci(response);
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const userWordsCount = (user === null || user === void 0 ? void 0 : user.wordsCount) || 0;
            const responseString = String(response);
            const plainTextResponse = responseString === null || responseString === void 0 ? void 0 : responseString.replace(/<[^>]*>/g, "");
            const characterCount = plainTextResponse.replace(/ /g, "").length;
            const wordCount = Math.ceil(characterCount / 7);
            if (user) {
                const subscriptions = yield Subscription_1.default.find();
                const findMatchingPlanTitle = (subscriptionId, subscriptions) => {
                    for (const subscription of subscriptions) {
                        const matchingPlan = subscription.plans.find((plan) => plan._id.toString() === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()));
                        if (matchingPlan) {
                            return matchingPlan;
                        }
                    }
                    return null;
                };
                const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
                if (matchingPlanTitle) {
                    if (userWordsCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed)) {
                        throw new Error("limit exceed please buy more words");
                    }
                    if (userWordsCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) &&
                        (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) < userWordsCount + wordCount) {
                        const remainingLimit = (matchingPlanTitle.wordsAllowed -
                            userWordsCount);
                        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
                    }
                }
            }
            if (!user.subscription) {
                let limit = 10000;
                if (userWordsCount >= limit) {
                    throw new Error("Free limit exceed please buy subscription");
                }
                if (userWordsCount < limit && limit < userWordsCount + wordCount) {
                    const remainingLimit = (limit - userWordsCount);
                    throw new Error(`Your remaining limit is ${remainingLimit} words.`);
                }
            }
            try {
                yield User_1.default.findByIdAndUpdate(userId, { $inc: { wordsCount: wordCount } });
            }
            catch (error) {
                console.error("Error updating wordsCount:", error);
            }
            yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.messageId": messageId }, { $set: { "messages.$.content": message } }, { new: true });
            const responseMsgObj = yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.responseTo": messageId }, { $set: { "messages.$.content": response } }, { new: true });
            const msgObj = (_b = responseMsgObj === null || responseMsgObj === void 0 ? void 0 : responseMsgObj.messages) === null || _b === void 0 ? void 0 : _b.find(el => (el === null || el === void 0 ? void 0 : el.responseTo) == messageId);
            // return {
            //   _id: chatId,
            //   message: message,
            //   response: response,
            //   messageId: messageId,
            // };
            return {
                chatId,
                message,
                messageId: msgObj.messageId,
                responseTo: messageId,
                response: response,
            };
        });
    }
    reStore(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId, message, messageId } = body;
            const previousChatMessages = yield Chat_1.default.findById(chatId).select("messages chatModel");
            const previousChatHistory = (_a = previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.messages) === null || _a === void 0 ? void 0 : _a.map((message) => {
                return {
                    role: message.sender === "chatbot" ? "system" : message.sender,
                    content: message.content,
                };
            });
            let response;
            if ((previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.chatModel) && (previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.chatModel) !== chats_1.CHAT_MODEL.CHAT_GPT_3) {
                response = yield LLama2Model_1.default.fetchAnswer(previousChatHistory, message);
            }
            else {
                response = yield ChatBot_1.default.fetchAnswer(previousChatHistory, message, chats_1.CHAT_TYPE.CHAT, previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.chatModel);
            }
            if ((0, textFormatting_1.getPlainTextFromHTML)(response) == message) {
                for (let i = 0; i < retries; i++) {
                    response = yield ChatBot_1.default.fetchAnswer(previousChatHistory, message);
                    if (response !== message) {
                        break;
                    }
                }
            }
            // let formattedResponse = await OpenAIBot.fetchAnswerDavinci(response);
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            const userWordsCount = (user === null || user === void 0 ? void 0 : user.wordsCount) || 0;
            const responseString = String(response);
            const plainTextResponse = responseString === null || responseString === void 0 ? void 0 : responseString.replace(/<[^>]*>/g, "");
            const characterCount = plainTextResponse.replace(/ /g, "").length;
            const wordCount = Math.ceil(characterCount / 7);
            if (user) {
                const subscriptions = yield Subscription_1.default.find();
                const findMatchingPlanTitle = (subscriptionId, subscriptions) => {
                    for (const subscription of subscriptions) {
                        const matchingPlan = subscription.plans.find((plan) => plan._id.toString() === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()));
                        if (matchingPlan) {
                            return matchingPlan;
                        }
                    }
                    return null;
                };
                const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
                if (matchingPlanTitle) {
                    if (userWordsCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed)) {
                        throw new Error("limit exceed please buy more words");
                    }
                    if (userWordsCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) &&
                        (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) < userWordsCount + wordCount) {
                        const remainingLimit = (matchingPlanTitle.wordsAllowed -
                            userWordsCount);
                        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
                    }
                }
            }
            if (!user.subscription) {
                let limit = 10000;
                if (userWordsCount >= limit) {
                    throw new Error("Free limit exceed please buy subscription");
                }
                if (userWordsCount < limit && limit < userWordsCount + wordCount) {
                    const remainingLimit = (limit - userWordsCount);
                    throw new Error(`Your remaining limit is ${remainingLimit} words.`);
                }
            }
            try {
                yield User_1.default.findByIdAndUpdate(userId, { $inc: { wordsCount: wordCount } });
            }
            catch (error) {
                console.error("Error updating wordsCount:", error);
            }
            const responseMsgObj = yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.responseTo": messageId }, { $set: { "messages.$.content": response } }, { new: true });
            const msgObj = (_b = responseMsgObj === null || responseMsgObj === void 0 ? void 0 : responseMsgObj.messages) === null || _b === void 0 ? void 0 : _b.find(el => (el === null || el === void 0 ? void 0 : el.responseTo) == messageId);
            // return {
            //   _id: chatId,
            //   message: message,
            //   response: response,
            //   messageId: messageId,
            // };
            return {
                chatId,
                message,
                messageId: msgObj.messageId,
                responseTo: messageId,
                response: response,
            };
        });
    }
    feedback(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId } = body;
            let { feedback } = body;
            feedback.rating = parseInt(feedback === null || feedback === void 0 ? void 0 : feedback.rating);
            if ((feedback === null || feedback === void 0 ? void 0 : feedback.rating) > 0 &&
                (feedback === null || feedback === void 0 ? void 0 : feedback.rating) < 6 &&
                !(0, lodash_1.isEmpty)(feedback === null || feedback === void 0 ? void 0 : feedback.comment)) {
                const chat = yield Chat_1.default.findOne({ _id: chatId, user: userId });
                if (!chat)
                    throw new Error("No chat found or invalid chatId");
                chat.feedback = feedback;
                yield chat.save();
                return chat;
            }
            else
                throw new Error("Invalid feedback value");
        });
    }
    updateChatList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { chatId, chatListId } = body;
            const chatList = yield ChatList_1.default.findOne({ _id: chatListId, user: userId });
            if (!chatList)
                throw new Error("No chat list id matched");
            const chat = yield Chat_1.default.findOne({ _id: chatId });
            if (!chat)
                throw new Error("No chat Id matched");
            if (chat.chatList == chatListId)
                throw new Error("This chat already belongs to same category.");
            chat.chatList = chatListId;
            yield chat.save();
            return chat;
        });
    }
    storeGoal(req) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { message, chatModel, chatId } = body;
            let messageId;
            let response;
            let chat;
            let createdAt;
            if (chatId) {
                response = yield LLama2Model_1.default.fetchAnswer([], message);
                chat = yield Chat_1.default.findById(chatId);
                if ((0, lodash_1.isEmpty)(chat))
                    throw new Error("No chat found with this Chat Id.");
                messageId = (0, uuid_1.v4)();
                const responseBotMessage = {
                    messageId: messageId,
                    sender: "chatbot",
                    content: response,
                    responseTo: null,
                };
                chat.messages.push(responseBotMessage);
                yield chat.save();
                response = response;
                createdAt = (_a = chat.messages[chat.messages.length - 1]) === null || _a === void 0 ? void 0 : _a.createdAt;
            }
            else {
                messageId = (0, uuid_1.v4)();
                const responseMessage = {
                    messageId: messageId,
                    sender: "chatbot",
                    content: message === null || message === void 0 ? void 0 : message.trim(),
                    responseTo: null,
                };
                chat = new Chat_1.default({ user: userId, chatModel });
                chat.messages.push(responseMessage);
                yield chat.save();
                response = message.trim();
                createdAt = (_b = chat.messages[chat.messages.length - 1]) === null || _b === void 0 ? void 0 : _b.createdAt;
            }
            return {
                message: null,
                response: chat.messages[((_c = chat.messages) === null || _c === void 0 ? void 0 : _c.length) - 1].content,
                messageId: messageId,
                chatListId: null,
                chatId: chat._id,
                createdAt: createdAt,
            };
        });
    }
    deleteMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { messageId, chatId } = body;
            const result = yield Chat_1.default.updateOne({ _id: chatId, user: userId }, {
                $pull: {
                    messages: {
                        $or: [
                            { messageId: messageId },
                            { responseTo: messageId }
                        ]
                    }
                }
            });
            const chat = yield Chat_1.default.findById(chatId);
            if ((0, lodash_1.size)(chat.messages) === 0) {
                yield Chat_1.default.findByIdAndDelete(chatId);
            }
            console.log('result', result);
            return result;
        });
    }
    updateMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { messageId, chatId, message, response } = body;
            yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.messageId": messageId }, { $set: { "messages.$.content": message } }, { new: true });
            yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.responseTo": messageId }, { $set: { "messages.$.content": response } }, { new: true });
            return "Chat reverted successfully";
        });
    }
}
exports.default = new ChatService();
//# sourceMappingURL=ChatService.js.map