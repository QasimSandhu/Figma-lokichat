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
const HandleChatResource_1 = __importDefault(require("../resources/Chat/HandleChatResource"));
const ChatService_1 = __importDefault(require("../services/ChatService"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const GetChatResource_1 = __importDefault(require("../resources/Chat/GetChatResource"));
const GetChatListsResource_1 = __importDefault(require("../resources/Chat/GetChatListsResource"));
const ShowChatResource_1 = __importDefault(require("../resources/Chat/ShowChatResource"));
const GetPromptResource_1 = __importDefault(require("../resources/Chat/GetPromptResource"));
const ChatListResources_1 = __importDefault(require("../resources/Chat/ChatListResources"));
const UpdateChatListResource_1 = __importDefault(require("../resources/Chat/UpdateChatListResource"));
class ChatController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.HandleChatRequest, ChatService_1.default.store, HandleChatResource_1.default);
        });
    }
    storeChatList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.GetChatListsRequest, ChatService_1.default.storeChatList, GetChatResource_1.default);
        });
    }
    reStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.UpdateChatMessageRequest, ChatService_1.default.reStore, HandleChatResource_1.default);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.HandleGetChatRequest, ChatService_1.default.show, GetChatResource_1.default);
        });
    }
    showDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.HandleGetChatRequest, ChatService_1.default.showDetails, ShowChatResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.UpdateChatMessageRequest, ChatService_1.default.update, HandleChatResource_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.GetChatListsRequest, ChatService_1.default.index, GetChatListsResource_1.default);
        });
    }
    indexByPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.GetChatListsRequest, ChatService_1.default.indexByPagination, ChatListResources_1.default);
        });
    }
    updateChatList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.UpdateChatListRequest, ChatService_1.default.updateChatList, UpdateChatListResource_1.default);
        });
    }
    feedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.AddChatFeedback, ChatService_1.default.feedback, GetChatResource_1.default);
        });
    }
    promptAdvisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, ChatService_1.default.promptAdvisor, GetPromptResource_1.default);
        });
    }
    storeGoal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, ChatService_1.default.storeGoal, HandleChatResource_1.default);
        });
    }
    deleteMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.DeleteMessage, ChatService_1.default.deleteMessage, HandleChatResource_1.default);
        });
    }
    updateMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.UpdateMessage, ChatService_1.default.updateMessage, HandleChatResource_1.default);
        });
    }
}
exports.default = new ChatController();
//# sourceMappingURL=ChatController.js.map