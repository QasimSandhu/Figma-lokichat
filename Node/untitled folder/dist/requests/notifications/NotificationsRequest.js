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
exports.StoreNotification = exports.UpdateNotificationsList = exports.GetNotifications = void 0;
const class_validator_1 = require("class-validator");
class GetNotifications {
    constructor(request) { }
}
exports.GetNotifications = GetNotifications;
class UpdateNotificationsList {
    constructor(request) { }
}
exports.UpdateNotificationsList = UpdateNotificationsList;
class StoreNotification {
    constructor(request) {
        this.message = request.body.message;
        this.from = request.body.from;
        this.receivers = request.body.receivers;
        this.readBy = request.body.readBy;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreNotification.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreNotification.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreNotification.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], StoreNotification.prototype, "receivers", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayMinSize)(0),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], StoreNotification.prototype, "readBy", void 0);
exports.StoreNotification = StoreNotification;
//# sourceMappingURL=NotificationsRequest.js.map