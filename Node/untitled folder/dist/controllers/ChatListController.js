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
const HandleChatRequest_1 = require("../requests/chat/HandleChatRequest");
const ChatListService_1 = __importDefault(require("../services/ChatListService"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const StoreChatListResource_1 = __importDefault(require("../resources/Chat/StoreChatListResource"));
const ShowChatListResource_1 = __importDefault(require("../resources/Chat/ShowChatListResource"));
const ChatListResources_1 = __importDefault(require("../resources/Chat/ChatListResources"));
const GetChatResource_1 = __importDefault(require("../resources/Chat/GetChatResource"));
class ChatController {
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.GetChatListsRequest, ChatListService_1.default.show, ShowChatListResource_1.default);
        });
    }
    showByPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.GetChatListsRequest, ChatListService_1.default.showByPagination, ChatListResources_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.GetChatListsRequest, ChatListService_1.default.index, StoreChatListResource_1.default);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.StoreChatList, ChatListService_1.default.store, StoreChatListResource_1.default);
        });
    }
    export(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.ExportChatLists, ChatListService_1.default.export, GetChatResource_1.default);
        });
    }
}
exports.default = new ChatController();
//# sourceMappingURL=ChatListController.js.map