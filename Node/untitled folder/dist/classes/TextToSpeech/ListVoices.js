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
class GetListVoices {
    constructor() {
        this.region = process.env.AZURE_SPEECH_SEARCH_REGION;
        this.subscriptionKey = process.env.AZURE_SPEECH_SEARCH_KEY;
    }
    getAvailableVoices() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getAuthorizationToken();
            if (!token) {
                return null;
            }
            const endpoint = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
            try {
                const response = yield axios_1.default.get(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const { data } = response;
                // Extract and return required attributes from the response
                const voices = data.map((voice) => ({
                    language: voice.Locale,
                    gender: voice.Gender,
                    speed: voice.WordsPerMinute,
                    shortName: voice.ShortName,
                    displayName: voice.DisplayName
                }));
                return voices;
                // return response.data;
            }
            catch (error) {
                console.error('Error fetching available voices:', error);
                return null;
            }
        });
    }
    getAuthorizationToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `https://${this.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
            try {
                const response = yield axios_1.default.post(endpoint, null, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
                        'Content-Length': 0,
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error('Error fetching authorization token:', error);
                return null;
            }
        });
    }
}
exports.default = new GetListVoices();
//   const ttsService = new TextToSpeechService(region);
//# sourceMappingURL=ListVoices.js.map