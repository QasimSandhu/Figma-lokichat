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
const Devices_1 = __importDefault(require("../models/Devices"));
class DevicesService {
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const devices = yield Devices_1.default.find({ user: userId });
            devices.sort((a, b) => b.date - a.date);
            return devices;
        });
    }
    saveDeviceIntoDB(data, isRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, ipAddress, browserName, os, browserVersion, isMobile, mobileId, mobileName } = data;
            let existingDevice;
            if (isMobile && isMobile === true) {
                existingDevice = yield Devices_1.default.findOne({
                    user: userId,
                    os,
                    mobileId
                });
            }
            else {
                existingDevice = yield Devices_1.default.findOne({
                    user: userId,
                    os,
                    ipAddress,
                    browserName,
                });
            }
            if (existingDevice) {
                if (!isRefreshToken) {
                    existingDevice.date = new Date();
                    yield existingDevice.save();
                }
                return existingDevice;
            }
            else {
                const device = new Devices_1.default({
                    os,
                    user: userId,
                    browserName,
                    ipAddress,
                    browserVersion,
                    mobileId,
                    mobileName,
                    date: new Date(),
                });
                yield device.save();
                return device;
            }
        });
    }
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { os, browserName, browserVersion, ipAddress, mobileId, mobileName } = body;
            const existingDevice = yield Devices_1.default.findOne({
                user: userId,
                os,
                ipAddress,
                browserName,
            });
            if (existingDevice) {
                existingDevice.date = new Date();
                yield existingDevice.save();
                return existingDevice;
            }
            else {
                const device = new Devices_1.default({
                    os,
                    user: userId,
                    browserName,
                    ipAddress,
                    browserVersion,
                    mobileId,
                    mobileName,
                    date: new Date(),
                });
                yield device.save();
                return device;
            }
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params } = req;
            const { deviceId } = params;
            const device = yield Devices_1.default.findByIdAndDelete(deviceId);
            if (!device)
                throw new Error("No loggedIn device found with this device ID");
            return device;
        });
    }
    destroyAll(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const deletedDevices = yield Devices_1.default.deleteMany({ user: userId });
            if (!deletedDevices.acknowledged)
                throw new Error("Could not logged out from all devices");
            return deletedDevices;
        });
    }
}
exports.default = new DevicesService();
//# sourceMappingURL=DevicesServices.js.map