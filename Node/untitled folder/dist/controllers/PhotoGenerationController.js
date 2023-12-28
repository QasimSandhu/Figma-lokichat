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
const PhotoGenerationService_1 = __importDefault(require("../services/PhotoGenerationService"));
const PhotoGenerationResource_1 = __importDefault(require("../resources/PhotoGeneration/PhotoGenerationResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const PhotoGenerationRequest_1 = require("../requests/photoGeneration/PhotoGenerationRequest");
class PhotoGenerationController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, PhotoGenerationRequest_1.PhotoGenerationRequest, PhotoGenerationService_1.default.store, PhotoGenerationResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, PhotoGenerationRequest_1.UpdateGeneratedPhoto, PhotoGenerationService_1.default.update, PhotoGenerationResource_1.default);
        });
    }
    fetchQueuedPhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, PhotoGenerationRequest_1.QueuedPhotoRequest, PhotoGenerationService_1.default.fetchQueuedPhoto, PhotoGenerationResource_1.default);
        });
    }
}
exports.default = new PhotoGenerationController();
//# sourceMappingURL=PhotoGenerationController.js.map