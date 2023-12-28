"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripeWebhookController_1 = __importDefault(require("../controllers/stripeWebhookController"));
const router = express_1.default.Router();
router.post('/stripeWebhook', stripeWebhookController_1.default.stripeWebhook);
exports.default = router;
//# sourceMappingURL=stripeWebhook.js.map