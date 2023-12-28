"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NotificationsController_1 = __importDefault(require("../controllers/NotificationsController"));
const router = express_1.default.Router();
router.get('/index', NotificationsController_1.default.index);
router.post('/store', NotificationsController_1.default.store);
router.post('/update', NotificationsController_1.default.update);
router.delete('/destroy/:notificationId', NotificationsController_1.default.destroy);
router.post('/read', NotificationsController_1.default.read);
router.post('/send-email', NotificationsController_1.default.sendMail);
exports.default = router;
//# sourceMappingURL=notifications.js.map