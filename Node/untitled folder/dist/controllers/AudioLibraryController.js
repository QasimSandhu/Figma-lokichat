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
const HandleAudioLibraryResource_1 = __importDefault(require("../resources/Audio/HandleAudioLibraryResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const AudioLibraryService_1 = __importDefault(require("../services/AudioLibraryService"));
const LoginResource_1 = __importDefault(require("../resources/Auth/LoginResource"));
class ChatController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.index, HandleAudioLibraryResource_1.default);
        });
    }
    indexPreviousMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.indexPreviousMonth, HandleAudioLibraryResource_1.default);
        });
    }
    sharedAudioLibrary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.sharedAudioLibrary, HandleAudioLibraryResource_1.default);
        });
    }
    sharedAudioLibraryPrevMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.sharedAudioLibraryPrevMonth, HandleAudioLibraryResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.update, HandleAudioLibraryResource_1.default);
        });
    }
    addSharedAudio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.addSharedAudio, HandleAudioLibraryResource_1.default);
        });
    }
    removeSharedAudio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.removeSharedAudio, HandleAudioLibraryResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.destroy, HandleAudioLibraryResource_1.default);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.getAllUsers, HandleAudioLibraryResource_1.default);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioLibraryService_1.default.getUser, LoginResource_1.default);
        });
    }
}
exports.default = new ChatController();
//# sourceMappingURL=AudioLibraryController.js.map