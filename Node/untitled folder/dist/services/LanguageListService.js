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
const Languages_1 = __importDefault(require("../models/Languages"));
class LanguageListService {
    constructor() {
        // this.store = this.store.bind(this);
        this.index = this.index.bind(this);
    }
    // async store() {
    //   const result = await insertVoicesListData();
    //   return result;
    // }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            let voiceLists = yield Languages_1.default.find({});
            return voiceLists;
        });
    }
}
exports.default = new LanguageListService();
//# sourceMappingURL=LanguageListService.js.map