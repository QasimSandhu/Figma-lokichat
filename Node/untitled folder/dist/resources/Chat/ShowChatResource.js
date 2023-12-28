"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ShowChatResource extends ApiResponse_1.default {
    constructor(data, error = "Sometihng went wrong while fetching chat") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            const formattedData = formatData(data);
            super(ApiResponse_1.default.success(formattedData, "chat fetched successfully"));
        }
    }
}
function formatData(data) {
    const returnedArray = [];
    for (let i = 0; i < (0, lodash_1.size)(data.messages) - 1; i += 2) {
        returnedArray.push({
            id: data._id,
            chatList: data.chatList,
            message: data.messages[i].content,
            response: data.messages[i + 1].content,
            messageId: data.messages[i].messageId,
            createdAt: data.messages[i].timestamp,
        });
    }
    return returnedArray;
}
exports.default = ShowChatResource;
//# sourceMappingURL=ShowChatResource.js.map