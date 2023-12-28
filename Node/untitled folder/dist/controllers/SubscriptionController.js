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
const SubscriptionService_1 = __importDefault(require("../services/SubscriptionService"));
const HandleSubscriptionResource_1 = __importDefault(require("../resources/Subscription/HandleSubscriptionResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const SubscriptionRequest_1 = require("../requests/subscription/SubscriptionRequest");
const HandlePlanResource_1 = __importDefault(require("../resources/Subscription/HandlePlanResource"));
const HandleBuyMoreResource_1 = __importDefault(require("../resources/Subscription/HandleBuyMoreResource"));
const HandleBillingResource_1 = __importDefault(require("../resources/Subscription/HandleBillingResource"));
const HandleReferralVerifyResource_1 = __importDefault(require("../resources/Subscription/HandleReferralVerifyResource"));
class SubscriptionController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, SubscriptionService_1.default.store, HandleSubscriptionResource_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SubscriptionRequest_1.ShowPlanRequest, SubscriptionService_1.default.index, HandleSubscriptionResource_1.default);
        });
    }
    planSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, SubscriptionService_1.default.planSubscription, HandlePlanResource_1.default);
        });
    }
    createPaymentIntent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, SubscriptionService_1.default.createPaymentIntent, HandleBuyMoreResource_1.default);
        });
    }
    billingPortal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, SubscriptionRequest_1.ShowPlanRequest, SubscriptionService_1.default.billingPortal, HandleBillingResource_1.default);
        });
    }
    verifyReferralCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, SubscriptionService_1.default.verifyReferralCode, HandleReferralVerifyResource_1.default);
        });
    }
}
exports.default = new SubscriptionController();
//# sourceMappingURL=SubscriptionController.js.map