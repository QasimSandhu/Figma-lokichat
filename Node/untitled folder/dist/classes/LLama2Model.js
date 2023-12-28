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
class LLama2Bot {
    constructor() {
        this.token = process.env.LLAMA2_MODEL_KEY;
        this.endpoint = process.env.LLAMA2_MODEL_URL;
        this.modelName = "meta-llama/Llama-2-70b-chat-hf";
        this.errorMessage = `Sorry, service is not available`;
    }
    fetchAnswer(oldMessages, newMessage) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                newMessage = newMessage;
                const initialMessage = {
                    "role": "system",
                    "content": `Your name is Loki who is an experienced professor who is proficient in multiple languages such as English, French, Spanish, Dutch etc. Your task is to provide the answer to the student in clear narration style paragraphs. Follow these instructions before initializing final response. 
 
        Rules:
        - Always reply in the language that the user is speaking 
        - Just start generating response rather than asking for clarifying question
        - ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.`
                };
                let messages = [];
                let payload = (_a = oldMessages === null || oldMessages === void 0 ? void 0 : oldMessages.filter((item) => item.role === "user" || item.role === 'system')) === null || _a === void 0 ? void 0 : _a.map((item) => {
                    return {
                        role: item.role === "system" ? "assistant" : item.role,
                        content: item.content,
                    };
                });
                payload.push({ role: "user", content: newMessage });
                messages = [initialMessage, ...payload];
                const { data } = yield axios_1.default.post(this.endpoint, { temperature: 0.4, model: this.modelName, messages }, {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${this.token}`,
                    },
                });
                if (data.choices[0] && ((_b = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _b === void 0 ? void 0 : _b.message)) {
                    const response = (_d = (_c = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
                    return response !== null && response !== void 0 ? response : this.errorMessage;
                }
                return this.errorMessage;
            }
            catch (error) {
                console.log("error", error.response);
                console.log("chat error", (_h = (_g = (_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.error) === null || _g === void 0 ? void 0 : _g.message) !== null && _h !== void 0 ? _h : this.errorMessage);
            }
        });
    }
    promptAdvisor(newMessage) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = newMessage;
                let payload = [];
                payload.push({ role: "user", content: content });
                let request = {
                    messages: [
                        {
                            role: "system",
                            content: `Assuming the role of a seasoned student who is very curious and tries to always ask more questions which are relevant to the topic. Always try to provide at least 10 follow-up questions. \n\nHere is the response from which you have to generate the questions: \"${content}`,
                        },
                        ...payload,
                    ],
                    temperature: 1,
                };
                request["model"] = "gpt-3.5-turbo-instruct";
                let { data } = yield axios_1.default.post(this.endpoint, request, {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${this.token}`,
                    },
                });
                if (data.choices && ((_a = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _a === void 0 ? void 0 : _a.message)) {
                    const response = (_b = data === null || data === void 0 ? void 0 : data.choices[0]) === null || _b === void 0 ? void 0 : _b.message.content;
                    const cleanedResponse = response.replace(/Assistant: \./, "");
                    return (_c = cleanedResponse.split("\n")) !== null && _c !== void 0 ? _c : this.errorMessage;
                }
                return this.errorMessage;
            }
            catch (error) {
                console.log("chat error", (_g = (_f = (_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : this.errorMessage);
                return (_l = (_k = (_j = (_h = error === null || error === void 0 ? void 0 : error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.error) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : this.errorMessage;
            }
        });
    }
}
exports.default = new LLama2Bot();
//# sourceMappingURL=LLama2Model.js.map