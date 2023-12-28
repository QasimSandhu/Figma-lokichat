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
exports.UpdateSuperUserRequest = exports.StoreSuperUserRequest = exports.GetSuperUserRequest = void 0;
const class_validator_1 = require("class-validator");
const CustomValidators_1 = require("../../lib/customValidators/CustomValidators");
class GetSuperUserRequest {
    constructor(request) { }
}
exports.GetSuperUserRequest = GetSuperUserRequest;
class StoreSuperUserRequest {
    constructor(request) {
        this.description = request.body.description;
        this.website = request.body.website;
        this.socialInfo = request.body.socialInfo;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], StoreSuperUserRequest.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreSuperUserRequest.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], StoreSuperUserRequest.prototype, "socialInfo", void 0);
exports.StoreSuperUserRequest = StoreSuperUserRequest;
class UpdateSuperUserRequest {
    constructor(request) {
        this.userToApprove = request.body.userToApprove;
        this.status = request.body.status;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, CustomValidators_1.IsStringOrNumber)(),
    __metadata("design:type", Object)
], UpdateSuperUserRequest.prototype, "userToApprove", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSuperUserRequest.prototype, "status", void 0);
exports.UpdateSuperUserRequest = UpdateSuperUserRequest;
//# sourceMappingURL=SuperUserRequest.js.map