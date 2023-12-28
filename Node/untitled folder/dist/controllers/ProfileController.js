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
const ProfileService_1 = __importDefault(require("../services/ProfileService"));
const HandleProfileResource_1 = __importDefault(require("../resources/Profile/HandleProfileResource"));
const ProfileRequestHandler_1 = require("../requests/profile/ProfileRequestHandler");
const UpdateUserNameResource_1 = __importDefault(require("../resources/Profile/UpdateUserNameResource"));
class ProfileController {
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, ProfileService_1.default.update, HandleProfileResource_1.default);
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, ProfileService_1.default.updatePassword, HandleProfileResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, ProfileRequestHandler_1.DestroyProfile, ProfileService_1.default.destroy, HandleProfileResource_1.default);
        });
    }
    destroyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, ProfileService_1.default.destroyUser, HandleProfileResource_1.default);
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, ProfileService_1.default.getUserProfile, HandleProfileResource_1.default);
        });
    }
    updateUserName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ProfileService_1.default.updateUserName(req);
                return res.status(200).json(new UpdateUserNameResource_1.default(result, "Username updated successfully", 200));
            }
            catch (error) {
                return res.status(500).json(new UpdateUserNameResource_1.default(null, error.message));
            }
        });
    }
}
exports.default = new ProfileController();
//# sourceMappingURL=ProfileController.js.map