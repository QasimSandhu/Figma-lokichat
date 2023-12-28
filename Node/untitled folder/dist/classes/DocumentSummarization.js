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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ai_language_text_1 = require("@azure/ai-language-text");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
class DocumentSummarizer {
    constructor() {
        this.readTextFile = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    var _a;
                    resolve((_a = event.target) === null || _a === void 0 ? void 0 : _a.result);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsText(file);
            });
        };
        this.endpoint = 'https://kamransummary.cognitiveservices.azure.com/';
        this.key = 'e62fdbf6b2a544f180a4fdb59adc45f6';
    }
    summarizeDocument(document, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new ai_language_text_1.TextAnalysisClient(this.endpoint, new ai_language_text_1.AzureKeyCredential(this.key));
            const options = {
                language: language,
                modelVersion: "latest",
                maxSentenceCount: 3, // Number of sentences in the summary
            };
            //@ts-ignore
            const result = yield client.extractSummary([document], options);
            return result[0].sentences.map((sentence) => sentence.text).join(" ");
        });
    }
    main(documents, maxSentenceCount) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("== Extractive Summarization Sample ==");
            const client = new ai_language_text_1.TextAnalysisClient(this.endpoint, new ai_language_text_1.AzureKeyCredential(this.key));
            const actions = [
                {
                    kind: "ExtractiveSummarization",
                    maxSentenceCount: maxSentenceCount,
                },
            ];
            //@ts-ignore
            const poller = yield client.beginAnalyzeBatch(actions, documents);
            poller.onProgress(() => {
                console.log(`Last time the operation was updated was on: ${poller.getOperationState().modifiedOn}`);
            });
            console.log(`The operation was created on ${poller.getOperationState().createdOn}`);
            console.log(`The operation results will expire on ${poller.getOperationState().expiresOn}`);
            const results = yield poller.pollUntilDone();
            var resultText = '';
            try {
                for (var _d = true, results_1 = __asyncValues(results), results_1_1; results_1_1 = yield results_1.next(), _a = results_1_1.done, !_a;) {
                    _c = results_1_1.value;
                    _d = false;
                    try {
                        const actionResult = _c;
                        if (actionResult.kind !== "ExtractiveSummarization") {
                            throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
                        }
                        if (actionResult.error) {
                            const { code, message } = actionResult.error;
                            throw new Error(`Unexpected error (${code}): ${message}`);
                        }
                        //@ts-ignore
                        for (const result of actionResult === null || actionResult === void 0 ? void 0 : actionResult.results) {
                            console.log(`- Document ${result.id}`);
                            if (result.error) {
                                const { code, message } = result.error;
                                throw new Error(`Unexpected error (${code}): ${message}`);
                            }
                            console.log("Summary:");
                            console.log(result.sentences.map((sentence) => sentence.text).join("\n"));
                            //@ts-ignore
                            resultText += result.sentences.map((sentence) => sentence.text).join("\n");
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = results_1.return)) yield _b.call(results_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return resultText;
        });
    }
    getFileText(file) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const type = file === null || file === void 0 ? void 0 : file.mimetype;
                if (type == 'application/pdf') {
                    const pdf = yield (0, pdf_parse_1.default)(file.buffer);
                    const text = pdf.text;
                    return text;
                }
                else if (type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { //'application/msword'
                    const result = yield mammoth_1.default.extractRawText({ buffer: file.buffer });
                    return result.value;
                }
                else if (type == 'text/plain') {
                    try {
                        const text = file.buffer.toString('utf8');
                        // console.log(text," ==>txt");
                        return text;
                    }
                    catch (error) {
                        throw new Error((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to read file.");
                    }
                }
                else {
                    throw new Error(`InValid File Sent`);
                }
            }
            catch (error) {
                throw new Error('Unable to extract text. Check the file content and try again.');
            }
        });
    }
}
exports.default = new DocumentSummarizer();
//# sourceMappingURL=DocumentSummarization.js.map