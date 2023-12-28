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
const DebateRequest_1 = require("../requests/debate/DebateRequest");
const DebateService_1 = __importDefault(require("../services/DebateService"));
const DebateResource_1 = __importDefault(require("../resources/Debate/DebateResource"));
const UpdateDebateResource_1 = __importDefault(require("../resources/Debate/UpdateDebateResource"));
const DebateResourcePagination_1 = __importDefault(require("../resources/Debate/DebateResourcePagination"));
const ReadDebateMessages_1 = __importDefault(require("../resources/Debate/ReadDebateMessages"));
class DebateController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.StoreDebate, DebateService_1.default.store, DebateResource_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.GetDebate, DebateService_1.default.index, DebateResourcePagination_1.default);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.GetDebate, DebateService_1.default.show, DebateResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.UpdateDebate, DebateService_1.default.update, UpdateDebateResource_1.default);
        });
    }
    updateMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.UpdateDebate, DebateService_1.default.updateMessages, UpdateDebateResource_1.default);
        });
    }
    updateInvitedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.UpdateDebateUsers, DebateService_1.default.updateInvitedUsers, UpdateDebateResource_1.default);
        });
    }
    updateBotMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.UpdateBotMessage, DebateService_1.default.updateBotMessages, UpdateDebateResource_1.default);
        });
    }
    leaveDebate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.UpdateDebate, DebateService_1.default.leaveDebate, UpdateDebateResource_1.default);
        });
    }
    markAsReadDebate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.UpdateDebate, DebateService_1.default.markAsReadDebate, ReadDebateMessages_1.default);
        });
    }
    removeUserFromDebate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, DebateRequest_1.RemoveUserFromDebate, DebateService_1.default.removeUserFromDebate, UpdateDebateResource_1.default);
        });
    }
}
exports.default = new DebateController();
//# sourceMappingURL=DebateController.js.map