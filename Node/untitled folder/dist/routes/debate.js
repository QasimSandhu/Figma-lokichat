"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DebateController_1 = __importDefault(require("../controllers/DebateController"));
const DebateStreamController_1 = __importDefault(require("../controllers/DebateStreamController"));
const router = express_1.default.Router();
router.get('/index', DebateController_1.default.index);
router.get('/show/:debateId', DebateController_1.default.show);
router.post('/store', DebateController_1.default.store);
router.post('/update', DebateController_1.default.update);
router.post('/update-stream', DebateStreamController_1.default.updateStream);
router.post('/update-invited-users', DebateController_1.default.updateInvitedUsers);
router.post('/update-message', DebateController_1.default.updateMessage);
router.post('/update-bot-message', DebateController_1.default.updateBotMessage);
router.post('/leave-debate', DebateController_1.default.leaveDebate);
router.post('/read-all-messages', DebateController_1.default.markAsReadDebate);
router.post('/remove-user', DebateController_1.default.removeUserFromDebate);
exports.default = router;
//# sourceMappingURL=debate.js.map