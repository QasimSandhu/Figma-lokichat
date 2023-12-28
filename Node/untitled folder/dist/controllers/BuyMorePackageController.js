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
const HandleBuyMoreResource_1 = __importDefault(require("../resources/BuyMore/HandleBuyMoreResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const SubscriptionRequest_1 = require("../requests/subscription/SubscriptionRequest");
const BuyMorePackageServcie_1 = __importDefault(require("../services/BuyMorePackageServcie"));
class BuyMorePackageController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, BuyMorePackageServcie_1.default.store, HandleBuyMoreResource_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SubscriptionRequest_1.ShowPlanRequest, BuyMorePackageServcie_1.default.index, HandleBuyMoreResource_1.default);
        });
    }
    indexById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SubscriptionRequest_1.ShowPlanRequest, BuyMorePackageServcie_1.default.indexById, HandleBuyMoreResource_1.default);
        });
    }
}
exports.default = new BuyMorePackageController();
//# sourceMappingURL=BuyMorePackageController.js.map