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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config/config"));
class TestChatBot {
    constructor() {
        this.token = config_1.default.chatGPT.apiKey;
        this.endpoint = `${config_1.default.chatGPT.endpoint}/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15`;
        this.errorMessage = `Sorry, service is not available`;
    }
    fetchAnswer(newMessage, systemPrompt, temperature, oldMessages) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = newMessage;
                console.log('conte', content);
                let payload = (_a = oldMessages === null || oldMessages === void 0 ? void 0 : oldMessages.filter((item) => item.role === "user")) === null || _a === void 0 ? void 0 : _a.map((item) => {
                    return {
                        role: item.role,
                        content: item.content,
                    };
                });
                payload.push({ role: "user", content: content });
                let request = {
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt || 'You are an AI assistant',
                        },
                        ...payload,
                    ],
                    temperature: temperature || 0.5, // Set your desired temperature value here
                };
                let { data } = yield axios_1.default.post(this.endpoint, request, {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${this.token}`,
                    },
                });
                if (data.choices && ((_b = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _b === void 0 ? void 0 : _b.message)) {
                    const response = (_c = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _c === void 0 ? void 0 : _c.message.content;
                    const cleanedResponse = response.replace(/Assistant: \./, "");
                    return cleanedResponse !== null && cleanedResponse !== void 0 ? cleanedResponse : this.errorMessage;
                }
                return this.errorMessage;
            }
            catch (error) {
                console.log('chat error', error);
                return this.errorMessage;
            }
        });
    }
}
exports.default = new TestChatBot();
//# sourceMappingURL=TestChatBot.js.map