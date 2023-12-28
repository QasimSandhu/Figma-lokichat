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
const AudioService_1 = __importDefault(require("../services/AudioService"));
const HandleAudioRequest_1 = require("../requests/audio/HandleAudioRequest");
const HandleAudioResource_1 = __importDefault(require("../resources/Audio/HandleAudioResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const HandleTranslationResource_1 = __importDefault(require("../resources/Translation/HandleTranslationResource"));
const DocumentSummarizationService_1 = __importDefault(require("../services/DocumentSummarizationService"));
class DocumentSummerizationController {
    generate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, DocumentSummarizationService_1.default.generate, HandleTranslationResource_1.default);
        });
    }
    examMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, DocumentSummarizationService_1.default.examMe, HandleTranslationResource_1.default);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleAudioRequest_1.ShowAudioRequest, AudioService_1.default.show, HandleAudioResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleAudioRequest_1.UpdateAudioRequest, AudioService_1.default.update, HandleAudioResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AudioService_1.default.destroy, HandleAudioResource_1.default);
        });
    }
}
exports.default = new DocumentSummerizationController();
//# sourceMappingURL=DocumentSummarizationController.js.map