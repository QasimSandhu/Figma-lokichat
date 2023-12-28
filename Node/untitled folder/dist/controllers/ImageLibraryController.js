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
const ImageLibraryService_1 = __importDefault(require("../services/ImageLibraryService"));
const ImageLibraryResources_1 = __importDefault(require("../resources/PhotoGeneration/ImageLibraryResources"));
const ImageLibraryResource_1 = __importDefault(require("../resources/PhotoGeneration/ImageLibraryResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const ImageLibraryRequest_1 = require("../requests/photoGeneration/ImageLibraryRequest");
class PhotoGenerationController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, ImageLibraryRequest_1.GetImageLibrary, ImageLibraryService_1.default.index, ImageLibraryResources_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, ImageLibraryRequest_1.UpdateImageLibrary, ImageLibraryService_1.default.update, ImageLibraryResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, ImageLibraryRequest_1.DestroyImageLibrary, ImageLibraryService_1.default.destroy, ImageLibraryResource_1.default);
        });
    }
}
exports.default = new PhotoGenerationController();
//# sourceMappingURL=ImageLibraryController.js.map