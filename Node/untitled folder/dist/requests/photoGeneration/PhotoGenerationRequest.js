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
exports.QueuedPhotoRequest = exports.UpdateGeneratedPhoto = exports.PhotoGenerationRequest = void 0;
const class_validator_1 = require("class-validator");
class PhotoGenerationRequest {
    constructor(request) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.prompt = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.prompt;
        this.noOfImages = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.noOfImages;
        this.negativePrompt = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.negativePrompt;
        this.interferenceSteps = (_d = request === null || request === void 0 ? void 0 : request.body) === null || _d === void 0 ? void 0 : _d.interferenceSteps;
        this.width = (_e = request === null || request === void 0 ? void 0 : request.body) === null || _e === void 0 ? void 0 : _e.width;
        this.height = (_f = request === null || request === void 0 ? void 0 : request.body) === null || _f === void 0 ? void 0 : _f.height;
        this.guidanceScale = (_g = request === null || request === void 0 ? void 0 : request.body) === null || _g === void 0 ? void 0 : _g.guidanceScale;
        this.enhancePrompt = (_h = request === null || request === void 0 ? void 0 : request.body) === null || _h === void 0 ? void 0 : _h.enhancePrompt;
        this.isNSFW = (_j = request === null || request === void 0 ? void 0 : request.body) === null || _j === void 0 ? void 0 : _j.isNSFW;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhotoGenerationRequest.prototype, "prompt", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhotoGenerationRequest.prototype, "noOfImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhotoGenerationRequest.prototype, "negativePrompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhotoGenerationRequest.prototype, "interferenceSteps", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhotoGenerationRequest.prototype, "width", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhotoGenerationRequest.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PhotoGenerationRequest.prototype, "guidanceScale", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PhotoGenerationRequest.prototype, "enhancePrompt", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PhotoGenerationRequest.prototype, "isNSFW", void 0);
exports.PhotoGenerationRequest = PhotoGenerationRequest;
class UpdateGeneratedPhoto {
    constructor(request) {
        var _a, _b, _c;
        this.messageId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.messageId;
        this.message = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.message;
        this.photoGeneratedId = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.photoGeneratedId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedPhoto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedPhoto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedPhoto.prototype, "photoGeneratedId", void 0);
exports.UpdateGeneratedPhoto = UpdateGeneratedPhoto;
class QueuedPhotoRequest {
    constructor(request) {
        var _a, _b;
        this.imageId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.imageId;
        this.photoId = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.photoId;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QueuedPhotoRequest.prototype, "imageId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueuedPhotoRequest.prototype, "photoId", void 0);
exports.QueuedPhotoRequest = QueuedPhotoRequest;
//# sourceMappingURL=PhotoGenerationRequest.js.map