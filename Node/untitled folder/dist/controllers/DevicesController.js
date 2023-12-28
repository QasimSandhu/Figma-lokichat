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
const requestHelper_1 = require("../lib/helpers/requestHelper");
const DevicesRequest_1 = require("../requests/devices/DevicesRequest");
const DevicesResource_1 = __importDefault(require("../resources/Devices/DevicesResource"));
const DevicesServices_1 = __importDefault(require("../services/DevicesServices"));
const DestroyAllDevicesResource_1 = __importDefault(require("../resources/Devices/DestroyAllDevicesResource"));
class DevicesController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DevicesRequest_1.IndexLoggedInDevices, DevicesServices_1.default.index, DevicesResource_1.default);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DevicesRequest_1.StoreLoggedInDevice, DevicesServices_1.default.store, DevicesResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DevicesRequest_1.DestroyLoggedInDevice, DevicesServices_1.default.destroy, DevicesResource_1.default);
        });
    }
    destroyAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DevicesRequest_1.DestroyLoggedInDevice, DevicesServices_1.default.destroyAll, DestroyAllDevicesResource_1.default);
        });
    }
}
exports.default = new DevicesController();
//# sourceMappingURL=DevicesController.js.map