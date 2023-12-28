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
exports.DestroyImageLibrary = exports.UpdateImageLibrary = exports.GetImageLibrary = void 0;
const class_validator_1 = require("class-validator");
class GetImageLibrary {
    constructor(request) { }
}
exports.GetImageLibrary = GetImageLibrary;
class UpdateImageLibrary {
    constructor(request) {
        var _a, _b;
        this.imageId = (_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.imageId;
        this.prompt = (_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.prompt;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageLibrary.prototype, "imageId", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageLibrary.prototype, "prompt", void 0);
exports.UpdateImageLibrary = UpdateImageLibrary;
class DestroyImageLibrary {
    constructor(request) { }
}
exports.DestroyImageLibrary = DestroyImageLibrary;
//# sourceMappingURL=ImageLibraryRequest.js.map