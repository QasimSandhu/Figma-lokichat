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
const Debate_1 = __importDefault(require("../models/Debate"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Notebook_1 = __importDefault(require("../models/Notebook"));
const DocumentSummarization_1 = __importDefault(require("../classes/DocumentSummarization"));
class NotebookService {
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { chatId, debateId, response, messageId } = body;
            if (!chatId && !debateId) {
                throw new Error('Required body params are missing');
            }
            const liveNotebook = new Notebook_1.default({
                user: userId,
                chat: chatId !== null && chatId !== void 0 ? chatId : null,
                debate: debateId,
                response,
                messageId,
            });
            if (chatId) {
                yield Chat_1.default.findOneAndUpdate({
                    _id: chatId,
                    user: userId,
                    "messages.messageId": messageId,
                }, { $set: { "messages.$.addedInNotebook": true } }, { new: true });
                yield liveNotebook.save();
            }
            else if (debateId) {
                yield Debate_1.default.findOneAndUpdate({
                    _id: debateId,
                    user: userId,
                    "messages._id": messageId,
                }, { $set: { "messages.$.addedInNotebook": true } }, { new: true });
            }
            yield liveNotebook.save();
            return liveNotebook;
        });
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { chatId, debateId } = body;
            if (!chatId && !debateId)
                throw new Error('Required body param is missing');
            if (chatId) {
                const liveNotebooks = yield Notebook_1.default.find({ user: userId, chat: chatId });
                liveNotebooks.sort((a, b) => b.createdAt - a.createdAt);
                return liveNotebooks;
            }
            else if (debateId) {
                const liveNotebooks = yield Notebook_1.default.find({ user: userId, debate: debateId });
                liveNotebooks.sort((a, b) => b.createdAt - a.createdAt);
                return liveNotebooks;
            }
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, userId } = req;
            const { notebookId } = params;
            if (!notebookId)
                throw new Error("notebookId is required to delete the notebook document");
            const deletedNotebook = yield Notebook_1.default.findByIdAndDelete(notebookId);
            if (!deletedNotebook)
                throw new Error("No Notebook document found with this id.");
            if (deletedNotebook.chat) {
                yield Chat_1.default.findOneAndUpdate({
                    _id: deletedNotebook.chat,
                    user: userId,
                    "messages.messageId": deletedNotebook.messageId,
                }, { $set: { "messages.$.addedInNotebook": false } }, { new: true });
            }
            else if (deletedNotebook.debate) {
                yield Debate_1.default.findOneAndUpdate({
                    _id: deletedNotebook.debate,
                    user: userId,
                    "messages._id": deletedNotebook.messageId,
                }, { $set: { "messages.$.addedInNotebook": false } }, { new: true });
            }
            return { _id: deletedNotebook._id };
        });
    }
    destroyByUserId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, body } = req;
            const { chatId, debateId } = body;
            let deletedNotebooks;
            if (chatId) {
                deletedNotebooks = yield Notebook_1.default.deleteMany({ user: userId, chat: chatId });
                yield Chat_1.default.updateMany({ _id: chatId, user: userId }, { $set: { "messages.$[].addedInNotebook": false } }, { new: true });
            }
            else if (debateId) {
                deletedNotebooks = yield Notebook_1.default.deleteMany({ user: userId, debate: debateId });
                yield Debate_1.default.updateMany({ _id: chatId, user: userId }, { $set: { "messages.$[].addedInNotebook": false } }, { new: true });
            }
            return { deletedNotebooks };
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { notebookId, response } = body;
            const liveNotebook = yield Notebook_1.default.findByIdAndUpdate(notebookId, { response }, { new: true });
            return {
                _id: liveNotebook._id,
                message: liveNotebook.message,
                response: liveNotebook.response,
                createdAt: liveNotebook.createdAt,
            };
        });
    }
    generateTextFromPdf(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { file } = req;
            try {
                const text = yield DocumentSummarization_1.default.getFileText(file);
                return text;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new NotebookService();
//# sourceMappingURL=NotebookService.js.map