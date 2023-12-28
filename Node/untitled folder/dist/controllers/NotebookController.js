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
const HandleChatRequest_1 = require("../requests/chat/HandleChatRequest");
const LiveNotebookResource_1 = __importDefault(require("../resources/Notebook/LiveNotebookResource"));
const NotebookService_1 = __importDefault(require("../services/NotebookService"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const GenerateTextResource_1 = __importDefault(require("../resources/Notebook/GenerateTextResource"));
class NotebookController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.AddToNotebookRequest, NotebookService_1.default.store, LiveNotebookResource_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, NotebookService_1.default.index, LiveNotebookResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, NotebookService_1.default.destroy, LiveNotebookResource_1.default);
        });
    }
    destroyByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.DeleteUserNotebooks, NotebookService_1.default.destroyByUserId, LiveNotebookResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, HandleChatRequest_1.UpdateNotebookRequest, NotebookService_1.default.update, LiveNotebookResource_1.default);
        });
    }
    generateTextFromPdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, NotebookService_1.default.generateTextFromPdf, GenerateTextResource_1.default);
        });
    }
}
exports.default = new NotebookController();
//# sourceMappingURL=NotebookController.js.map