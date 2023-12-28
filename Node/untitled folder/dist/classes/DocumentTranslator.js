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
const axios_1 = __importDefault(require("axios"));
const { BlobServiceClient } = require("@azure/storage-blob");
class DocumentTranslator {
    constructor() {
        // this.connectionString = "DefaultEndpointsProtocol=https;AccountName=first1122;AccountKey=d4EB3gn9Uvl891S7WPoVqhumDyA4s8C25SUU6V2j6Etm8+M6eTfc7UVzRkX545wrqdJSBH0Ibgpj+AStB2U4ng==;EndpointSuffix=core.windows.net";
        // this.containerName = process.env.AZURE_CONTAINER_NAME || "mycontainer";
        // this.postBatchUrl = "https://kamran.cognitiveservices.azure.com/translator/text/batch/v1.1"
        // this.route = "/batches"
        // this.key = process.env.AZURE_TRANSLATION_REQUEST_KEY || "b4c76100cd944086a32a94d2a0cc15f4";
        // this.targetContainer = "https://first1122.blob.core.windows.net/mycontainer"
        // this.token = 'sp=racwdli&st=2023-10-10T16:24:04Z&se=2025-10-11T00:24:04Z&spr=https&sv=2022-11-02&sr=c&sig=sygRuMTuD0JsSyR9EfgMY1qb5Zoj%2FnkUFnurObSxmyk%3D'
        this.connectionString = "DefaultEndpointsProtocol=https;AccountName=lokichatdev;AccountKey=Y5nOZqSkUTR601Gj45v4QIiBojPBJA1flszrr2BZ+XVkPmTAaBVhnOS9zG5eE8+ung32FmsH+OYl+AStY9t0TQ==;EndpointSuffix=core.windows.net";
        this.containerName = process.env.AZURE_CONTAINER_NAME || "translatedcontainer";
        this.postBatchUrl = "https://westeurope.api.cognitive.microsoft.com/translator/text/batch/v1.1";
        this.route = "/batches";
        this.key = process.env.AZURE_TRANSLATION_REQUEST_KEY || "ffa1afcb1bae462ba76ff64f12d068c1";
        this.targetContainer = "https://lokichatdev.blob.core.windows.net/translatedcontainer";
        this.token = 'sp=racwdli&st=2023-12-04T06:33:28Z&se=2026-04-01T14:33:28Z&spr=https&sv=2022-11-02&sr=c&sig=reQBKmMRdYX9Rqok%2FQkQSTdz6rgPmInmtaSaGURiONo%3D';
    }
    uploadToAzureStorage(filePath, buffer, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
            const containerClient = blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(filePath);
            try {
                yield blockBlobClient.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: contentType } });
                console.log("File uploaded successfully.");
                const uploadedUrl = blockBlobClient.url;
                return uploadedUrl; // Return the uploaded URL
            }
            catch (error) {
                console.error("Error during file upload:", error, error.message);
                throw error; // Re-throw the error to be caught in the /synthesize endpoint
            }
        });
    }
    submitDTRequest(urlToDocumentToTranslate, toLanguage, translatedFileName) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function* () {
            let data0 = {
                inputs: [
                    {
                        storageType: "File",
                        source: {
                            sourceUrl: `${urlToDocumentToTranslate}`,
                            // storageSource: "AzureBlob",
                            // language: "en"
                        },
                        targets: [{
                                targetUrl: `${this.targetContainer}/${translatedFileName}?${this.token}`,
                                storageSource: "AzureBlob",
                                category: "general",
                                language: toLanguage
                            }]
                    },
                ]
            };
            let config = {
                method: 'post',
                url: this.postBatchUrl + this.route,
                headers: {
                    'Ocp-Apim-Subscription-Key': this.key,
                    'Content-Type': 'application/json'
                },
                data: data0
            };
            console.log(JSON.stringify(config.data), " ===> config");
            let result;
            try {
                const res = yield axios_1.default.request(config);
                result = {
                    success: (res === null || res === void 0 ? void 0 : res.status) == 202 ? true : false,
                    status: res === null || res === void 0 ? void 0 : res.status,
                    translatedFileUrl: `${this.targetContainer}/${translatedFileName}`,
                    data: res === null || res === void 0 ? void 0 : res.data,
                    headers: res === null || res === void 0 ? void 0 : res.headers,
                    statusText: res === null || res === void 0 ? void 0 : res.statusText,
                };
            }
            catch (error) {
                console.log((_a = error.message) !== null && _a !== void 0 ? _a : error.msg, JSON.stringify(error), " ===> error");
                result = {
                    success: false,
                    data: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data,
                    stringError: JSON.stringify(error),
                    message: (_m = (_l = (_j = (_f = (_e = (_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : (_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) !== null && _j !== void 0 ? _j : (_k = error === null || error === void 0 ? void 0 : error.data) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : error === null || error === void 0 ? void 0 : error.message) !== null && _m !== void 0 ? _m : "Failed to translate due to unknown reason.",
                    code: (_o = error === null || error === void 0 ? void 0 : error.code) !== null && _o !== void 0 ? _o : "",
                    response: (_p = error === null || error === void 0 ? void 0 : error.response) !== null && _p !== void 0 ? _p : {}
                };
            }
            return result;
        });
    }
    getBatchDetails(batchUrl) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let config = {
                method: 'get',
                url: batchUrl,
                headers: {
                    'Ocp-Apim-Subscription-Key': this.key,
                    'Content-Type': 'application/json'
                },
                data: {}
            };
            let result;
            try {
                const res = yield axios_1.default.request(config);
                result = {
                    success: (res === null || res === void 0 ? void 0 : res.status) == 200 ? true : false,
                    status: res === null || res === void 0 ? void 0 : res.status,
                    data: res === null || res === void 0 ? void 0 : res.data,
                    headers: res === null || res === void 0 ? void 0 : res.headers,
                    statusText: res === null || res === void 0 ? void 0 : res.statusText,
                };
            }
            catch (error) {
                result = {
                    success: false,
                    data: error,
                    stringError: JSON.stringify(error),
                    message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "",
                    code: (_b = error === null || error === void 0 ? void 0 : error.code) !== null && _b !== void 0 ? _b : "",
                    response: (_c = error === null || error === void 0 ? void 0 : error.response) !== null && _c !== void 0 ? _c : {}
                };
            }
            console.log(result.data, (_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.summary) === null || _e === void 0 ? void 0 : _e.success, (_g = (_f = result === null || result === void 0 ? void 0 : result.data) === null || _f === void 0 ? void 0 : _f.summary) === null || _g === void 0 ? void 0 : _g.failed, " second Result");
            return result;
        });
    }
    recursiveBatchDetails(batchUrl) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getBatchDetails(batchUrl);
            if (result.success == true) {
                if (((_a = result.data) === null || _a === void 0 ? void 0 : _a.status) == 'Running' || ((_b = result.data) === null || _b === void 0 ? void 0 : _b.status) == 'NotStarted') {
                    yield this.waitOneSecond();
                    return yield this.recursiveBatchDetails(batchUrl);
                }
                else if (((_c = result.data) === null || _c === void 0 ? void 0 : _c.status) == 'Succeeded') {
                    return result;
                }
                else {
                    return {
                        success: false,
                        data: result === null || result === void 0 ? void 0 : result.data,
                        stringError: JSON.stringify(result === null || result === void 0 ? void 0 : result.data),
                        message: (_f = (_e = (_d = result.data) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : "",
                        code: (_j = (_h = (_g = result.data) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.code) !== null && _j !== void 0 ? _j : "",
                        response: (_k = result === null || result === void 0 ? void 0 : result.data) !== null && _k !== void 0 ? _k : {}
                    };
                }
            }
            else {
                return result;
            }
        });
    }
    waitOneSecond() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log('2 second wait');
                    resolve();
                }, 2000);
            });
        });
    }
}
exports.default = new DocumentTranslator();
//# sourceMappingURL=DocumentTranslator.js.map