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
exports.UpdateBotMessage = exports.RemoveUserFromDebate = exports.UpdateDebateUsers = exports.UpdateDebate = exports.GetDebate = exports.StoreDebate = void 0;
const class_validator_1 = require("class-validator");
class StoreDebate {
    constructor(request) {
        this.title = request.body.title;
        this.invitedUsers = request.body.invitedUsers;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreDebate.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    __metadata("design:type", Array)
], StoreDebate.prototype, "invitedUsers", void 0);
exports.StoreDebate = StoreDebate;
class GetDebate {
    constructor(request) { }
}
exports.GetDebate = GetDebate;
class UpdateDebate {
    constructor(request) {
        this.debateId = request.body.debateId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDebate.prototype, "debateId", void 0);
exports.UpdateDebate = UpdateDebate;
class UpdateDebateUsers {
    constructor(request) {
        this.debateId = request.body.debateId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDebateUsers.prototype, "debateId", void 0);
exports.UpdateDebateUsers = UpdateDebateUsers;
class RemoveUserFromDebate {
    constructor(request) {
        this.debateId = request.body.debateId;
        this.userToRemove = request.body.userToRemove;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveUserFromDebate.prototype, "debateId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveUserFromDebate.prototype, "userToRemove", void 0);
exports.RemoveUserFromDebate = RemoveUserFromDebate;
class UpdateBotMessage {
    constructor(request) {
        this.debateId = request.body.debateId;
        this.messageId = request.body.messageId;
        this.responseTo = request.body.responseTo;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBotMessage.prototype, "debateId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBotMessage.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBotMessage.prototype, "responseTo", void 0);
exports.UpdateBotMessage = UpdateBotMessage;
//# sourceMappingURL=DebateRequest.js.map