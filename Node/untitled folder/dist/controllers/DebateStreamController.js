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
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const readline_1 = __importDefault(require("readline"));
const Chat_1 = __importDefault(require("../models/Chat"));
const uuid_1 = require("uuid");
const chats_1 = require("../lib/constants/chats");
const lodash_1 = require("lodash");
const SocketIO_1 = require("../classes/SocketIO");
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const Debate_1 = __importDefault(require("../models/Debate"));
const textFormatting_1 = require("../lib/helpers/textFormatting");
const debate_1 = require("../lib/constants/debate");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const deepInfraUrl = process.env.LLAMA2_MODEL_URL;
const deepInfraToken = process.env.LLAMA2_MODEL_KEY;
const deepInfraModel = 'meta-llama/Llama-2-70b-chat-hf';
const socket = new SocketIO_1.Socket();
class StreamController {
    updateStream(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { message, debateId, mentionedUsers, isBotMentioned, responseTo } = body;
            const debate = yield Debate_1.default.findById(debateId);
            if (!debate) {
                res.status(400).json({ success: false, message: "no debate found with this id", status: 400 });
            }
            const updatedMessage = {
                sender: userId,
                message: message,
                mentionedUsers: mentionedUsers || [],
                isBotMentioned: isBotMentioned || false,
                responseTo: responseTo || null,
                readBy: [userId]
            };
            debate.messages.push(updatedMessage);
            yield debate.save();
            if (isBotMentioned) {
                const debateMsg = (0, textFormatting_1.getPlainTextFromHTML)(message);
                // here will have to make that process.
                const filename = `${userId}_${new Date().getTime()}`;
                let _messages = [
                    {
                        role: "system",
                        content: `!IMPORTANT [NOTE] ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.`,
                    },
                ];
                const newMessage = {
                    role: chats_1.CHAT_ROLES.USER,
                    content: debateMsg
                };
                _messages.push(newMessage);
                const messageId = (0, uuid_1.v4)();
                // const botResponse = await LLama2Bot.fetchAnswer([],debateMsg);
                //@ts-ignore
                (0, axios_1.default)({
                    method: "post",
                    url: deepInfraUrl,
                    data: {
                        model: deepInfraModel,
                        stream: true,
                        temperature: 0.3,
                        max_new_tokens: 1096,
                        messages: _messages,
                    },
                    responseType: "stream",
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${deepInfraToken}`,
                    },
                })
                    .then((response) => {
                    response.data.pipe(res);
                    response.data.pipe(fs_1.default.createWriteStream(`${filename}.txt`));
                    response.data.on("end", () => {
                        res.end();
                        const fileStream = fs_1.default.createReadStream(`${filename}.txt`);
                        const rl = readline_1.default.createInterface({
                            input: fileStream,
                            crlfDelay: Infinity,
                        });
                        let full_text = "";
                        rl.on("line", (line) => {
                            var _a, _b, _c;
                            if (line.length > 0 && line.includes("data")) {
                                line = line.replace("data: ", "");
                                if (line !== "[DONE]") {
                                    try {
                                        line = JSON.parse(line);
                                        full_text += (_c = (_b = (_a = line === null || line === void 0 ? void 0 : line.choices[0]) === null || _a === void 0 ? void 0 : _a.delta) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : "";
                                    }
                                    catch (error) {
                                        console.log('stream error', error);
                                        //   throw new Error(`'Stream Error: '${error?.message ?? ''}`);
                                    }
                                }
                            }
                        });
                        rl.on("close", () => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            try {
                                console.log("Here Full text", full_text);
                                const lastMessageIdx = (0, lodash_1.size)(debate.messages);
                                const botMessage = {
                                    sender: userId,
                                    message: full_text,
                                    mentionedUsers: mentionedUsers || [],
                                    isBotResponse: true,
                                    responseTo: (_a = debate.messages[lastMessageIdx - 1]) === null || _a === void 0 ? void 0 : _a._id,
                                    readBy: [userId]
                                };
                                debate.messages.push(botMessage);
                                yield debate.save();
                                //    const socketMsg = {
                                //     id: chat._id,
                                //     title: chat?.title,
                                //     color: chat?.color,
                                //     message: message,
                                //     response: full_text,
                                //     messageId,
                                //     createdAt: chat?.messages[chat.messages.length - 1].timestamp,
                                //   };
                                //   console.log('socketMsg', socketMsg);
                                //    socket.emit(`${SOCKET_EVENT_TYPES.CREATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
                                fs_1.default.unlink(`./${filename}.txt`, function () {
                                    console.log("File");
                                });
                            }
                            catch (error) {
                                console.log("Error in saving messages", error);
                                //    throw new Error(`${error.message ?? "service error"}`);
                            }
                        }));
                    });
                })
                    .catch((error) => {
                    res.end();
                    console.error("Request error:", error.message);
                    // throw new Error("internal server error");
                    res.status(500).json({ success: false, message: "internal server error", status: 500 });
                });
            }
            let notificationReceivers = [...debate.invitedUsers, debate.user];
            notificationReceivers = notificationReceivers.filter((id) => id != userId);
            const notification = {
                title: `${debate_1.DEBATE_NEW_MESSAGE}`,
                name: notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
                message: `You have a new message in ${debate.title} debate.`,
                from: userId,
                receivers: notificationReceivers,
            };
            const notifications = new Notifications_1.default(notification);
            yield notifications.save();
            yield debate.populate({
                path: "user invitedUsers messages.sender",
                select: "email userName profileUrl",
            });
            pushNewMessageNotification(debate, notificationReceivers);
            const formattedDebate = formatData(debate);
            return res.status(200).json({ success: true, data: formattedDebate, status: 200 });
        });
    }
    updateStreamMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId, message, messageId } = body;
            let chat;
            chat = yield Chat_1.default.findById(chatId).select('messages chatModel');
            if ((0, lodash_1.isEmpty)(chat))
                return res.status(400).json({ success: false, message: "No chat found", status: 400 });
            if (chat.chatModel && chat.chatModel !== chats_1.CHAT_MODEL.LLAMA2_MODEL)
                return res.status(400).json({ success: false, message: "invliad chat model", status: 400 });
            const filename = `${userId}_${new Date().getTime()}`;
            let _messages = [
                {
                    role: "system",
                    content: `!IMPORTANT NOTE ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.`,
                },
                {
                    role: chats_1.CHAT_ROLES.USER,
                    content: message,
                },
            ];
            //@ts-ignore
            (0, axios_1.default)({
                method: "post",
                url: deepInfraUrl,
                data: {
                    model: deepInfraModel,
                    stream: true,
                    // temperature: 0.3,
                    // max_new_tokens: 1096,
                    messages: _messages,
                },
                responseType: "stream",
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${deepInfraToken}`,
                },
            })
                .then((response) => {
                response.data.pipe(res);
                response.data.pipe(fs_1.default.createWriteStream(`${filename}.txt`));
                response.data.on("end", () => {
                    const fileStream = fs_1.default.createReadStream(`${filename}.txt`);
                    const rl = readline_1.default.createInterface({ input: fileStream, crlfDelay: Infinity });
                    let full_text = "";
                    rl.on("line", (line) => {
                        var _a, _b, _c, _d;
                        if (line.length > 0 && line.includes("data")) {
                            line = line.replace("data: ", "");
                            if (line !== "[DONE]") {
                                try {
                                    line = JSON.parse(line);
                                    full_text += (_c = (_b = (_a = line === null || line === void 0 ? void 0 : line.choices[0]) === null || _a === void 0 ? void 0 : _a.delta) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : "";
                                }
                                catch (error) {
                                    console.log('stream error', error);
                                    throw new Error(`'Stream Error: '${(_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : ''}`);
                                }
                            }
                        }
                    });
                    rl.on("close", () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            console.log("Here Full text", full_text);
                            yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.messageId": messageId }, { $set: { "messages.$.content": message } }, { new: true });
                            yield Chat_1.default.findOneAndUpdate({ _id: chatId, "messages.responseTo": messageId }, { $set: { "messages.$.content": full_text } }, { new: true });
                            const socketMsg = {
                                id: chatId,
                                messageId,
                                message: message,
                                response: full_text,
                            };
                            console.log('socketMsg', socketMsg);
                            socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.UPDATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
                            fs_1.default.unlink(`./${filename}.txt`, function () {
                                console.log("Error");
                            });
                        }
                        catch (error) {
                            console.log("Error in saving messages", error);
                        }
                    }));
                });
            })
                .catch((error) => {
                console.error("Request error:", error);
            });
        });
    }
}
const pushNewMessageNotification = (debate, notificationReceivers) => {
    for (let i = 0; i < (0, lodash_1.size)(notificationReceivers); i++) {
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`, { message: debate.messages[debate.messages.length - 2] });
        socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`, { message: debate.messages[debate.messages.length - 1] });
    }
};
const formatMessage = (message) => {
    return {
        id: message._id,
        sender: message.sender,
        message: message.message,
        mentionedUsers: message.mentionedUsers,
        isBotMentioned: message.isBotMentioned,
        isBotResponse: message.isBotResponse,
        responseTo: message.responseTo,
        createdAt: message.createdAt
    };
};
const formatData = (data) => {
    var _a;
    const formattedMessages = (_a = data.messages) === null || _a === void 0 ? void 0 : _a.map(formatMessage);
    return {
        id: data._id,
        user: data.user,
        title: data.title,
        invitedUsers: data.invitedUsers,
        leavedDebateUsers: data.leavedDebateUsers,
        messages: formattedMessages,
        createdAt: data.createdAt
    };
};
exports.default = new StreamController();
//# sourceMappingURL=DebateStreamController.js.map