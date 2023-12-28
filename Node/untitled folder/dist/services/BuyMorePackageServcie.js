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
const BuyMore_1 = __importDefault(require("../models/BuyMore"));
class BuyMoreService {
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, title, type, price, limit } = req.body;
                // If 'id' is provided, update the existing BuyMore record
                if (id) {
                    const updatedBuyMore = yield BuyMore_1.default.findByIdAndUpdate(id, { title, type, price, limit }, { new: true });
                    return (updatedBuyMore);
                }
                else {
                    // If 'id' is not provided, create a new BuyMore record
                    const newBuyMore = new BuyMore_1.default({ title, type, price, limit });
                    const savedBuyMore = yield newBuyMore.save();
                    return (savedBuyMore);
                }
            }
            catch (error) {
                throw new Error('Error creating/updating BuyMore record');
            }
        });
    }
    ;
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.query;
                const buyMoreRecords = yield BuyMore_1.default.find({ type: type });
                return (buyMoreRecords);
            }
            catch (error) {
                throw new Error('error');
            }
        });
    }
    indexById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const buyMoreRecords = yield BuyMore_1.default.find({ _id: id });
                return (buyMoreRecords);
            }
            catch (error) {
                throw new Error('error');
            }
        });
    }
}
exports.default = new BuyMoreService();
//# sourceMappingURL=BuyMorePackageServcie.js.map