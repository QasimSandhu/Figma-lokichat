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
const DocumentTranslator_1 = __importDefault(require("../classes/DocumentTranslator"));
const User_1 = __importDefault(require("../models/User"));
const Translations_1 = __importDefault(require("../models/Translations"));
class DocumentTranslationService {
    store(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId, file } = req;
            const { targetLanguage } = body;
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            try {
                const fileBuffer = file.buffer;
                const originalName = `${new Date().toString()}.${(_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.split('.')[((_b = file === null || file === void 0 ? void 0 : file.originalname) === null || _b === void 0 ? void 0 : _b.split('.').length) - 1]}`; // `${file?.originalname}`
                const sourceUploadUrl = yield DocumentTranslator_1.default.uploadToAzureStorage(originalName, fileBuffer, file === null || file === void 0 ? void 0 : file.mimetype);
                const result = yield DocumentTranslator_1.default.submitDTRequest(sourceUploadUrl, targetLanguage, `${new Date().getTime()}-${targetLanguage}-${originalName !== null && originalName !== void 0 ? originalName : "Unknown"}`);
                if ((result === null || result === void 0 ? void 0 : result.status) == 202) {
                    const batchUrl = result === null || result === void 0 ? void 0 : result.headers['operation-location'];
                    const batchDetails = yield DocumentTranslator_1.default.recursiveBatchDetails(batchUrl);
                    if (batchDetails.success == true) {
                        var totalCharacterCharged = (_d = (_c = batchDetails === null || batchDetails === void 0 ? void 0 : batchDetails.data) === null || _c === void 0 ? void 0 : _c.summary) === null || _d === void 0 ? void 0 : _d.totalCharacterCharged;
                        const createTranslation = yield Translations_1.default.create({
                            user: userId,
                            originalDocumentUrl: sourceUploadUrl,
                            translatedDocumentUrl: result === null || result === void 0 ? void 0 : result.translatedFileUrl,
                            totalCharacterCharged: totalCharacterCharged !== null && totalCharacterCharged !== void 0 ? totalCharacterCharged : 0,
                            getRequestBatchUrl: batchUrl,
                            type: 'DOCUMENT',
                            translatedLanguage: targetLanguage
                        });
                        console.log(createTranslation, " ===> createTranslation");
                        if (createTranslation) {
                            return createTranslation;
                        }
                        else {
                            console.log("db creation error throws from here.");
                            throw new Error('Translation unsuccessful. Ensure the input is valid and retry.');
                        }
                    }
                    else {
                        console.log("Second Error throws from here.");
                        throw new Error('Translation unsuccessful. Ensure the input is valid and retry.');
                    }
                }
                else {
                    console.log("First Error throws from here");
                    throw new Error('Translation unsuccessful. Ensure the input is valid and retry.');
                }
            }
            catch (error) {
                console.log('err-catch', error);
                throw new Error(error);
            }
        });
    }
}
exports.default = new DocumentTranslationService();
//# sourceMappingURL=DocumentTranslationService.js.map