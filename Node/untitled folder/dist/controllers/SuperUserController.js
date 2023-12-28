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
const SuperUserRequest_1 = require("../requests/superUser/SuperUserRequest");
const SuperUserService_1 = __importDefault(require("../services/SuperUserService"));
const SuperUserResource_1 = __importDefault(require("../resources/SuperUser/SuperUserResource"));
class SuperUserController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SuperUserRequest_1.GetSuperUserRequest, SuperUserService_1.default.index, SuperUserResource_1.default);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SuperUserRequest_1.StoreSuperUserRequest, SuperUserService_1.default.store, SuperUserResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SuperUserRequest_1.UpdateSuperUserRequest, SuperUserService_1.default.update, SuperUserResource_1.default);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SuperUserRequest_1.GetSuperUserRequest, SuperUserService_1.default.show, SuperUserResource_1.default);
        });
    }
}
exports.default = new SuperUserController();
//# sourceMappingURL=SuperUserController.js.map