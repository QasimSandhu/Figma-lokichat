"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_ROLES = exports.CHAT_MODEL = exports.CHAT_FEEDBACK = exports.CHAT_TYPE = exports.CHAT_LANGUAGES = exports.DATE_SPAN = void 0;
exports.DATE_SPAN = {
    TODAY: "today",
    LASTWEEK: "lastWeek",
    LAST30DAYS: "last30Days",
    OLDER: "older",
};
exports.CHAT_LANGUAGES = {
    EN: "en",
    FR: "fr",
    ES: "es",
};
exports.CHAT_TYPE = {
    CHAT: "CHAT",
    SUMMARY: "SUMMARY",
    EXAM: "EXAM",
};
exports.CHAT_FEEDBACK = {
    GOOD: "good",
    BETTER: "better",
    SAME: "same",
};
exports.CHAT_MODEL = {
    CHAT_GPT_3: 'gpt-35-turbo',
    LLAMA2_MODEL: 'Llama-2-70b-chat-hf',
};
exports.CHAT_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant',
    CHATBOT: 'chatbot'
};
//# sourceMappingURL=chats.js.map