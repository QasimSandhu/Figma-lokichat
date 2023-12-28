"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StripeController_1 = __importDefault(require("../controllers/StripeController"));
const router = express_1.default.Router();
router.get('/getAccountSetupLink', StripeController_1.default.getSetupAccountLink);
router.get('/getPendingTransactions', StripeController_1.default.getPendingTransactions);
router.get('/getTransactionHistory', StripeController_1.default.getTransactionHistory);
router.post('/transferToConnectAccount', StripeController_1.default.transferToConnectAccount);
router.get('/getConnectAccountLoginLink', StripeController_1.default.getStripeConnectAccountLoginLink);
router.get('/getConnectAccountDetails', StripeController_1.default.getStripeConnectAccountDetails);
exports.default = router;
//# sourceMappingURL=stripe.js.map