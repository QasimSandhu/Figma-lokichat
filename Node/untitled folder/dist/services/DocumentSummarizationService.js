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
//@ts-ignore
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("../models/User"));
const DocumentSummarization_1 = __importDefault(require("../classes/DocumentSummarization"));
const Chat_1 = __importDefault(require("../models/Chat"));
const ChatBot_1 = __importDefault(require("../classes/ChatBot"));
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const SocketIO_1 = require("../classes/SocketIO");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const chats_1 = require("../lib/constants/chats");
const socket = new SocketIO_1.Socket();
class DocumentSummerizationService {
    generate(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, file } = req;
            const { chatId } = req.body;
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            try {
                const text = yield DocumentSummarization_1.default.getFileText(file);
                const originalName = (file === null || file === void 0 ? void 0 : file.originalname) || new Date().toString();
                if (text.length < 500) {
                    throw new Error("This document lacks valid or sufficient content for summarization.");
                }
                let previousChatHistory = [];
                if (chatId && chatId != undefined && chatId != "undefined") {
                    const previousChatMessages = yield Chat_1.default.findById(chatId).select("messages");
                    previousChatHistory = (_a = previousChatMessages === null || previousChatMessages === void 0 ? void 0 : previousChatMessages.messages) === null || _a === void 0 ? void 0 : _a.map((message) => {
                        return {
                            role: message.sender === "chatbot" ? "system" : message.sender,
                            content: message.content,
                        };
                    });
                }
                function recursiveSummary(t) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            let chunkArray = [];
                            let startIndex = 0;
                            while (startIndex < t.length) {
                                chunkArray.push(t.substring(startIndex, startIndex + 4000));
                                startIndex += 4000;
                            }
                            console.log(chunkArray, t.length, 'chunkarray');
                            const responseArray = yield Promise.all(chunkArray === null || chunkArray === void 0 ? void 0 : chunkArray.map((txt, ind) => __awaiter(this, void 0, void 0, function* () {
                                console.log(txt.length, " length");
                                const chunkRes = yield ChatBot_1.default.fetchAnswer([], `${txt}.`, 'sum');
                                return chunkRes;
                            })));
                            const result = responseArray.join(' ');
                            const response = (result.length < 10000 && chunkArray.length < 2) ? result : yield recursiveSummary(result);
                            // return response?.replace(/\n/g, '<br /><br />');
                            return response;
                        }
                        catch (error) {
                            throw new Error('Summary generation failed. Please review your file content and try again.');
                        }
                    });
                }
                const result = yield recursiveSummary(text);
                const messageId = (0, uuid_1.v4)();
                const senderMessage = {
                    messageId: messageId,
                    sender: "user",
                    content: `Summary for ${originalName}`,
                };
                const responseMessage = {
                    messageId: (0, uuid_1.v4)(),
                    sender: "assistant",
                    // content: `<h6 style='font-weight=25px;' ><b>Summary for ${originalName} :</b></h6> ${result?.trim()}`,
                    content: `${result === null || result === void 0 ? void 0 : result.trim()}`,
                    responseTo: messageId,
                    type: "SUMMARY",
                };
                var createdChat;
                var createdAt;
                console.log(senderMessage, responseMessage, " senderMessage");
                if (!chatId || chatId == undefined || chatId == "undefined") {
                    createdChat = yield Chat_1.default.create({
                        user: userId,
                        messages: [senderMessage, responseMessage],
                        type: "SUMMARY",
                    });
                    createdAt = createdChat.createdAt;
                }
                else {
                    createdChat = yield Chat_1.default.findOne({ _id: chatId, user: userId });
                    createdChat.messages.push(senderMessage);
                    createdChat.messages.push(responseMessage);
                    yield createdChat.save();
                    createdAt = createdChat.updatedAt;
                }
                if (createdChat) {
                    const returningData = {
                        message: `Summary for : ${originalName}`,
                        response: `${result === null || result === void 0 ? void 0 : result.trim()}`,
                        messageId,
                        id: createdChat._id,
                        createdAt: createdAt,
                        type: "SUMMARY"
                    };
                    const notification = {
                        title: 'Summary Generation Success.',
                        user: userId,
                        name: notificationsTypes_1.SOCKET_EVENT_TYPES.SUMMARY_STATUS,
                        message: `Your Summary request has been completed successfully. Total words consumption is ${Number(result === null || result === void 0 ? void 0 : result.length) / 7}`,
                        from: userId,
                        receivers: [userId]
                    };
                    const notifications = new Notifications_1.default(notification);
                    yield notifications.save();
                    socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.SUMMARY_STATUS, {
                        isNotification: true,
                        userIds: [userId]
                    });
                    return returningData;
                }
                else {
                    throw new Error("Failed to add chat to db.");
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    static recursiveSummary(t) {
        return __awaiter(this, void 0, void 0, function* () {
            if (4000 < (t === null || t === void 0 ? void 0 : t.length)) {
                return t;
            }
            let chunkArray = [];
            let startIndex = 0;
            while (startIndex < t.length) {
                chunkArray.push(t.substring(startIndex, startIndex + 4000));
                startIndex += 4000;
            }
            // console.log(chunkArray, t.length, 'chunkarray');
            const responseArray = yield Promise.all(chunkArray === null || chunkArray === void 0 ? void 0 : chunkArray.map((txt, ind) => __awaiter(this, void 0, void 0, function* () {
                const chunkRes = yield ChatBot_1.default.fetchAnswer([], `${txt}.`, 'sum');
                return chunkRes;
            })));
            const result = responseArray.join(' ');
            const response = (result.length < 4000 && chunkArray.length < 2) ? result : yield DocumentSummerizationService.recursiveSummary(result);
            return response;
            // return response?.replace(/\n/g, '<br /><br />');
        });
    }
    examMe(req) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const file = req.file;
            const chatId = req.body.chatId;
            const subject = req.body.subject;
            const type = req.body.type;
            const curChat = req.body.curChat;
            const domain = req.body.domain;
            if (!type || !['subject', 'chat', 'document'].includes(type)) {
                throw new Error('Invalid type sent.');
            }
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            var createdChat;
            var createdAt;
            var mcqResponse = '';
            try {
                if (type == 'subject') {
                    mcqResponse = yield ChatBot_1.default.fetchMCQS(type, { subject, domain });
                }
                else if (type == 'chat') {
                    const allMessages = yield Chat_1.default.findById(chatId);
                    const messagesArray = (_a = allMessages === null || allMessages === void 0 ? void 0 : allMessages.messages) !== null && _a !== void 0 ? _a : (_b = allMessages === null || allMessages === void 0 ? void 0 : allMessages._doc) === null || _b === void 0 ? void 0 : _b.messages;
                    if (!messagesArray) {
                        throw new Error('Invalid or not applicable chat selected.');
                    }
                    console.log(messagesArray, " messageArray");
                    let text = '';
                    for (let i = 0; i < (messagesArray === null || messagesArray === void 0 ? void 0 : messagesArray.length); i++) {
                        text += ((_c = messagesArray[i]) === null || _c === void 0 ? void 0 : _c.sender) == 'user'
                            ?
                                `Question: ${(_d = messagesArray[i]) === null || _d === void 0 ? void 0 : _d.content}`
                            :
                                `GPT Answer: ${(_e = messagesArray[i]) === null || _e === void 0 ? void 0 : _e.content}`;
                    }
                    // console.log(text," ===> text");
                    const getSendableData = yield DocumentSummerizationService.recursiveSummary(text);
                    // console.log(getSendableData," ===> Get Send Able Data");
                    mcqResponse = yield ChatBot_1.default.fetchMCQS(type, { getSendableData });
                }
                else if (type == 'document') {
                    console.log(file);
                    let text = yield DocumentSummarization_1.default.getFileText(file);
                    const getSendableData = yield DocumentSummerizationService.recursiveSummary(text);
                    mcqResponse = yield ChatBot_1.default.fetchMCQS(type, { getSendableData });
                }
                else {
                    throw new Error('Invalid type sent');
                }
                const messageId = (0, uuid_1.v4)();
                const senderMessage = {
                    messageId: messageId,
                    sender: "user",
                    content: type == 'chat' ? `MCQ's for selected chat` : type == 'document' ? `MCQ's for ${(_f = file === null || file === void 0 ? void 0 : file.originalname) !== null && _f !== void 0 ? _f : 'selected file'}` : `MCQ's for ${subject}(${domain})`,
                };
                const responseMessage = {
                    messageId: (0, uuid_1.v4)(),
                    sender: "chatbot",
                    // content: `<h6 style='font-weight=25px;' ><b>Summary for ${originalName} :</b></h6> ${result?.trim()}`,
                    content: `${mcqResponse === null || mcqResponse === void 0 ? void 0 : mcqResponse.trim()}`,
                    responseTo: messageId,
                };
                if (!curChat || curChat == undefined || curChat == "undefined") {
                    createdChat = yield Chat_1.default.create({
                        user: userId,
                        messages: [senderMessage, responseMessage],
                        type: chats_1.CHAT_TYPE.EXAM,
                    });
                    createdAt = createdChat.createdAt;
                }
                else {
                    createdChat = yield Chat_1.default.findOne({ _id: curChat, user: userId });
                    createdChat.messages.push(senderMessage);
                    createdChat.messages.push(responseMessage);
                    yield createdChat.save();
                    createdAt = createdChat.updatedAt;
                }
                if (createdChat) {
                    const returningData = {
                        message: type == 'chat' ? `MCQ's for selected chat` : type == 'document' ? `MCQ's for ${(_g = file === null || file === void 0 ? void 0 : file.originalname) !== null && _g !== void 0 ? _g : 'selected file'}` : `MCQ's for ${subject}(${domain})`,
                        response: `${mcqResponse === null || mcqResponse === void 0 ? void 0 : mcqResponse.trim()}`,
                        messageId,
                        id: createdChat._id,
                        createdAt: createdAt,
                    };
                    // const notification = {
                    //   title: 'Summary Generation Success.',
                    //   user: userId,
                    //   name: SOCKET_EVENT_TYPES.SUMMARY_STATUS,
                    //   message: `Your Summary request has been completed successfully. Total words consumption is ${Number(mcqResponse?.length)/7}`,
                    //   from: '65291a4b64a424c209e8f360',
                    //   receivers: [userId]
                    // }
                    // socket.emit(SOCKET_EVENT_TYPES.SUMMARY_STATUS,returningData)
                    // const notifications = new Notifications(notification);
                    // await notifications.save();
                    return returningData;
                }
                else {
                    throw new Error("Failed to add chat to db.");
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new DocumentSummerizationService();
//# sourceMappingURL=DocumentSummarizationService.js.map