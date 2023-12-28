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
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const { v4 } = require("uuid");
class AzureTranslator {
    constructor() {
        this.endpoint = process.env.AZURE_TRANSLATOR_END_POINT;
        this.region = process.env.AZURE_TRANSLATOR_REGION;
        this.subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
    }
    translateText(text, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.endpoint}/translate?api-version=3.0&to=${lang}`;
            const headers = {
                "Ocp-Apim-Subscription-Key": this.subscriptionKey,
                "Ocp-Apim-Subscription-Region": this.region,
                "Content-type": "application/json",
                "X-ClientTraceId": v4().toString(),
            };
            const data = [{ text: text }];
            const response = yield axios.post(url, data, { headers });
            const translations = response.data[0].translations;
            if (translations && translations.length > 0) {
                return translations[0].text;
            }
        });
    }
}
exports.default = new AzureTranslator();
//# sourceMappingURL=TextTranslation.js.map