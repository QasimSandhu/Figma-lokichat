"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SubscriptionController_1 = __importDefault(require("../controllers/SubscriptionController"));
const router = express_1.default.Router();
router.post('/store', SubscriptionController_1.default.store);
router.get('/index', SubscriptionController_1.default.index);
router.post('/plan-subscription', SubscriptionController_1.default.planSubscription);
router.post('/create-payment-intent', SubscriptionController_1.default.createPaymentIntent);
router.get('/billingPortal', SubscriptionController_1.default.billingPortal);
router.post('/verifyReferralCode', SubscriptionController_1.default.verifyReferralCode);
exports.default = router;
//# sourceMappingURL=subscription.js.map