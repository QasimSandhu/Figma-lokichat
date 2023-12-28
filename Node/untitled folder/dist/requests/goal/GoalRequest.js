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
exports.DestroyGoalRequest = exports.IndexGoalRequest = exports.UpdateGoalRequest = exports.ShowGoalRequest = exports.HandleGoalRequest = void 0;
const class_validator_1 = require("class-validator");
class HandleGoalRequest {
    constructor(request) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.name = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.name;
        this.keyPoint1 = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.keyPoint1;
        this.keyPoint2 = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.keyPoint2;
        this.keyPoint3 = (_d = request === null || request === void 0 ? void 0 : request.body) === null || _d === void 0 ? void 0 : _d.keyPoint3;
        this.dueOnDate = (_e = request === null || request === void 0 ? void 0 : request.body) === null || _e === void 0 ? void 0 : _e.dueOnDate;
        this.notificationsReminder = (_f = request === null || request === void 0 ? void 0 : request.body) === null || _f === void 0 ? void 0 : _f.notificationsReminder;
        this.reminderFrequency = (_g = request === null || request === void 0 ? void 0 : request.body) === null || _g === void 0 ? void 0 : _g.reminderFrequency;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleGoalRequest.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleGoalRequest.prototype, "dueOnDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleGoalRequest.prototype, "keyPoint1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleGoalRequest.prototype, "keyPoint2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleGoalRequest.prototype, "keyPoint3", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HandleGoalRequest.prototype, "notificationsReminder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], HandleGoalRequest.prototype, "reminderFrequency", void 0);
exports.HandleGoalRequest = HandleGoalRequest;
class ShowGoalRequest {
    constructor(request) {
        var _a;
        this.goalId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.goalId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShowGoalRequest.prototype, "goalId", void 0);
exports.ShowGoalRequest = ShowGoalRequest;
class UpdateGoalRequest {
    constructor(request) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.name = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.name;
        this.goalId = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.goalId;
        this.keyPoint1 = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.keyPoint1;
        this.keyPoint2 = (_d = request === null || request === void 0 ? void 0 : request.body) === null || _d === void 0 ? void 0 : _d.keyPoint2;
        this.keyPoint3 = (_e = request === null || request === void 0 ? void 0 : request.body) === null || _e === void 0 ? void 0 : _e.keyPoint3;
        this.dueOnDate = (_f = request === null || request === void 0 ? void 0 : request.body) === null || _f === void 0 ? void 0 : _f.dueOnDate;
        this.notificationsReminder = (_g = request === null || request === void 0 ? void 0 : request.body) === null || _g === void 0 ? void 0 : _g.notificationsReminder;
        this.reminderFrequency = (_h = request === null || request === void 0 ? void 0 : request.body) === null || _h === void 0 ? void 0 : _h.reminderFrequency;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGoalRequest.prototype, "goalId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGoalRequest.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGoalRequest.prototype, "dueOnDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGoalRequest.prototype, "notificationsReminder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], UpdateGoalRequest.prototype, "reminderFrequency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGoalRequest.prototype, "keyPoint1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGoalRequest.prototype, "keyPoint2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGoalRequest.prototype, "keyPoint3", void 0);
exports.UpdateGoalRequest = UpdateGoalRequest;
class IndexGoalRequest {
}
exports.IndexGoalRequest = IndexGoalRequest;
class DestroyGoalRequest {
}
exports.DestroyGoalRequest = DestroyGoalRequest;
//# sourceMappingURL=GoalRequest.js.map