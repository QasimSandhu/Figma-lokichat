"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatListRequest = exports.StoreChatList = exports.AddChatFeedback = exports.UpdateMessage = exports.DeleteMessage = exports.ExportChatLists = exports.GetChatListsRequest = exports.DeleteUserNotebooks = exports.UpdateChatMessageRequest = exports.UpdateNotebookRequest = exports.AddToNotebookRequest = exports.GetChatListRequest = exports.HandleGetChatRequest = exports.HandleChatRequest = void 0;
const class_validator_1 = require("class-validator");
class HandleChatRequest {
    constructor(request) {
        var _a, _b, _c;
        this.message = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.message;
        this.chatId = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.chatId;
        this.chatListId = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.chatListId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleChatRequest.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleChatRequest.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleChatRequest.prototype, "chatListId", void 0);
exports.HandleChatRequest = HandleChatRequest;
class HandleGetChatRequest {
    constructor(request) {
        var _a;
        this.chatId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.chatId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleGetChatRequest.prototype, "chatId", void 0);
exports.HandleGetChatRequest = HandleGetChatRequest;
class GetChatListRequest {
    constructor(request) {
        var _a;
        this.chatListId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.chatListId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetChatListRequest.prototype, "chatListId", void 0);
exports.GetChatListRequest = GetChatListRequest;
class AddToNotebookRequest {
    constructor(request) {
        var _a, _b, _c, _d, _e;
        this.chatId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.chatId;
        this.debateId = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.debateId;
        this.message = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.message;
        this.response = (_d = request === null || request === void 0 ? void 0 : request.body) === null || _d === void 0 ? void 0 : _d.response;
        this.messageId = (_e = request === null || request === void 0 ? void 0 : request.body) === null || _e === void 0 ? void 0 : _e.messageId;
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToNotebookRequest.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToNotebookRequest.prototype, "debateId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToNotebookRequest.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToNotebookRequest.prototype, "response", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToNotebookRequest.prototype, "messageId", void 0);
exports.AddToNotebookRequest = AddToNotebookRequest;
class UpdateNotebookRequest {
    constructor(request) {
        var _a, _b;
        this.notebookId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.notebookId;
        this.response = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.response;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNotebookRequest.prototype, "notebookId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNotebookRequest.prototype, "response", void 0);
exports.UpdateNotebookRequest = UpdateNotebookRequest;
class UpdateChatMessageRequest {
    constructor(request) {
        var _a, _b, _c;
        this.messageId = (_a = request.body) === null || _a === void 0 ? void 0 : _a.messageId;
        this.message = (_b = request.body) === null || _b === void 0 ? void 0 : _b.message;
        this.chatId = (_c = request.body) === null || _c === void 0 ? void 0 : _c.chatId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatMessageRequest.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatMessageRequest.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatMessageRequest.prototype, "chatId", void 0);
exports.UpdateChatMessageRequest = UpdateChatMessageRequest;
class DeleteUserNotebooks {
    constructor(request) {
        this.chatId = request.body.chatId;
        this.debateId = request.body.debateId;
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteUserNotebooks.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteUserNotebooks.prototype, "debateId", void 0);
exports.DeleteUserNotebooks = DeleteUserNotebooks;
class GetChatListsRequest {
    constructor(request) { }
}
exports.GetChatListsRequest = GetChatListsRequest;
class ExportChatLists {
    constructor(request) { }
}
exports.ExportChatLists = ExportChatLists;
class DeleteMessage {
    constructor(request) {
        this.chatId = request.body.chatId;
        this.messageId = request.body.messageId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteMessage.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteMessage.prototype, "messageId", void 0);
exports.DeleteMessage = DeleteMessage;
class UpdateMessage {
    constructor(request) {
        this.chatId = request.body.chatId;
        this.messageId = request.body.messageId;
        this.message = request.body.message;
        this.response = request.body.response;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMessage.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMessage.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMessage.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMessage.prototype, "response", void 0);
exports.UpdateMessage = UpdateMessage;
class AddChatFeedback {
    constructor(request) {
        this.chatId = request.body.chatId;
        this.feedback = request.body.feedback;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddChatFeedback.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", String)
], AddChatFeedback.prototype, "feedback", void 0);
exports.AddChatFeedback = AddChatFeedback;
class StoreChatList {
    constructor(request) {
        this.title = request.body.title;
        this.color = request.body.color;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreChatList.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreChatList.prototype, "color", void 0);
exports.StoreChatList = StoreChatList;
class UpdateChatListRequest {
    constructor(request) {
        this.chatId = request.body.chatId;
        this.chatListId = request.body.chatListId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatListRequest.prototype, "chatId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatListRequest.prototype, "chatListId", void 0);
exports.UpdateChatListRequest = UpdateChatListRequest;
//# sourceMappingURL=HandleChatRequest.js.map