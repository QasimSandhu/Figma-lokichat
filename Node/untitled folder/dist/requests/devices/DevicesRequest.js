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
exports.DestroyAllDevices = exports.DestroyLoggedInDevice = exports.IndexLoggedInDevices = exports.StoreLoggedInDevice = void 0;
const class_validator_1 = require("class-validator");
class StoreLoggedInDevice {
    constructor(request) {
        this.os = request.body.os;
        this.browserName = request.body.browserName;
        this.browserVersion = request.body.browserVersion;
        this.ipAddress = request.body.ipAddress;
    }
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreLoggedInDevice.prototype, "browserName", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreLoggedInDevice.prototype, "os", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreLoggedInDevice.prototype, "browserVersion", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreLoggedInDevice.prototype, "ipAddress", void 0);
exports.StoreLoggedInDevice = StoreLoggedInDevice;
class IndexLoggedInDevices {
}
exports.IndexLoggedInDevices = IndexLoggedInDevices;
class DestroyLoggedInDevice {
}
exports.DestroyLoggedInDevice = DestroyLoggedInDevice;
class DestroyAllDevices {
}
exports.DestroyAllDevices = DestroyAllDevices;
//# sourceMappingURL=DevicesRequest.js.map