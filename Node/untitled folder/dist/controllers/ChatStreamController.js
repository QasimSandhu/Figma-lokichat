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
const subscrptions_1 = require("../lib/helpers/subscrptions");
const User_1 = __importDefault(require("../models/User"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const deepInfraUrl = process.env.LLAMA2_MODEL_URL;
const deepInfraToken = process.env.LLAMA2_MODEL_KEY;
const deepInfraModel = 'meta-llama/Llama-2-70b-chat-hf';
const socket = new SocketIO_1.Socket();
const systemPrompt = {
    role: "system",
    content: `
  Your name is Loki who is an experienced professor who is proficient in multiple languages such as English, French, Spanish, Dutch etc. Your task is to provide the answer to the student in clear narration style paragraphs. Follow these instructions before initializing final response. 
 
  Rules:
  - Always reply in the language that the user is speaking 
  - Just start generating response rather than asking for clarifying question
  - ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.
`,
    // content: `Please give me a precise answer
};
class ChatStreamController {
    storeStream(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            let { message, chatModel, chatListId, chatId, messagePassCode } = body;
            let oldMessages = [];
            let chat;
            if (!(0, lodash_1.isEmpty)(chatId)) {
                chat = yield Chat_1.default.findById(chatId).select('messages');
                if ((0, lodash_1.isEmpty)(chat)) {
                    return res.status(400).json({ success: false, message: "No chat found", status: 400 });
                }
            }
            const user = yield User_1.default.findById(userId);
            const subscriptions = yield Subscription_1.default.find();
            try {
                yield (0, subscrptions_1.verifyRemainingWords)(user, subscriptions);
            }
            catch (err) {
                return res.status(400).json({ success: false, message: err.message, status: 400 });
            }
            const filename = `${userId}_${messagePassCode}_${new Date().getTime()}`;
            let _messages = [systemPrompt];
            const newMessage = {
                role: chats_1.CHAT_ROLES.USER,
                content: message
            };
            if ((0, lodash_1.size)(oldMessages) > 0) {
                const formattedMessages = oldMessages.map((msg) => ({
                    role: msg.sender,
                    content: msg.content
                }));
                _messages = [..._messages, ...formattedMessages];
            }
            _messages.push(newMessage);
            const messageId = (0, uuid_1.v4)();
            const senderMessage = {
                messageId: messageId,
                sender: chats_1.CHAT_ROLES.USER,
                content: message,
            };
            //@ts-ignore
            (0, axios_1.default)({
                method: "post",
                url: deepInfraUrl,
                data: {
                    model: deepInfraModel,
                    stream: true,
                    temperature: 0.3,
                    max_new_tokens: 4096,
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
                        try {
                            console.log("Here Full text", full_text);
                            const responseMessage = {
                                messageId: (0, uuid_1.v4)(),
                                sender: chats_1.CHAT_ROLES.ASSISTANT,
                                content: full_text,
                                responseTo: messageId,
                            };
                            if (chatId) {
                                chat.messages.push(senderMessage);
                                chat.messages.push(responseMessage);
                                yield chat.save();
                            }
                            else {
                                chat = new Chat_1.default({
                                    user: userId,
                                    messages: [senderMessage, responseMessage],
                                    chatList: chatListId || null,
                                    chatModel: chatModel,
                                });
                                yield chat.save();
                            }
                            chatId = chat._id;
                            const socketMsg = {
                                id: chat._id,
                                messageId,
                                messagePassCode,
                                message: message,
                                response: full_text,
                                chatList: chat.chatList || null,
                                createdAt: chat === null || chat === void 0 ? void 0 : chat.messages[chat.messages.length - 1].timestamp,
                            };
                            socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.CREATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
                            yield (0, subscrptions_1.updateStreamWordsCounter)(user, full_text, subscriptions);
                            fs_1.default.unlink(`./${filename}.txt`, function () {
                                console.log("File");
                            });
                            console.log('Connection closed');
                            response.data.unpipe(res);
                        }
                        catch (error) {
                            console.log("Error in saving messages", error);
                            //    throw new Error(`${error.message ?? "service error"}`);
                        }
                    }));
                });
            })
                .catch((error) => {
                console.error("Request error:", error.message);
                // throw new Error("internal server error");
                res.status(500).json({ success: false, message: "internal server error", status: 500 });
            });
        });
    }
    updateStream(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { chatId, message, messageId, messagePassCode } = body;
            let chat;
            chat = yield Chat_1.default.findById(chatId).select('messages chatModel chatList');
            if ((0, lodash_1.isEmpty)(chat))
                return res.status(400).json({ success: false, message: "No chat found", status: 400 });
            if (chat.chatModel && chat.chatModel !== chats_1.CHAT_MODEL.LLAMA2_MODEL)
                return res.status(400).json({ success: false, message: "invliad chat model", status: 400 });
            const user = yield User_1.default.findById(userId);
            const subscriptions = yield Subscription_1.default.find();
            try {
                yield (0, subscrptions_1.verifyRemainingWords)(user, subscriptions);
            }
            catch (err) {
                return res.status(400).json({ success: false, message: err.message, status: 400 });
            }
            const filename = `${userId}_${new Date().getTime()}`;
            let _messages = [
                systemPrompt,
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
                    temperature: 0.3,
                    max_new_tokens: 4096,
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
                                messagePassCode,
                                message: message,
                                response: full_text,
                                chatList: chat.chatList || null,
                            };
                            socket.emit(`${notificationsTypes_1.SOCKET_EVENT_TYPES.UPDATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
                            yield (0, subscrptions_1.updateStreamWordsCounter)(user, full_text, subscriptions);
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
exports.default = new ChatStreamController();
//# sourceMappingURL=ChatStreamController.js.map