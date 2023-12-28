"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../../lib/response/ApiResponse"));
class ReadDebateMessages extends ApiResponse_1.default {
    constructor(data, error = "Sometihing went wrong.") {
        if (!data) {
            super(ApiResponse_1.default.error(error));
        }
        else {
            super(ApiResponse_1.default.success({}, "All debate messages marked as read"));
        }
    }
}
exports.default = ReadDebateMessages;
//# sourceMappingURL=ReadDebateMessages.js.map