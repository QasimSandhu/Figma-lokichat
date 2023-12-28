"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const ChatStreamController_1 = __importDefault(require("../controllers/ChatStreamController"));
const router = express_1.default.Router();
router.get('/index', ChatController_1.default.index);
router.get('/indexByPagination', ChatController_1.default.indexByPagination);
router.get('/promptAdvisor', ChatController_1.default.promptAdvisor);
router.post('/store', ChatController_1.default.store);
router.post('/store-stream', ChatStreamController_1.default.storeStream);
router.post('/update-stream', ChatStreamController_1.default.updateStream);
router.post('/store-goal', ChatController_1.default.storeGoal);
router.post('/store-chat-list', ChatController_1.default.storeChatList);
router.post('/re-store', ChatController_1.default.reStore);
router.post('/show', ChatController_1.default.show);
router.post('/show-details', ChatController_1.default.showDetails);
router.post('/update-chat-list', ChatController_1.default.updateChatList);
router.post('/feedback', ChatController_1.default.feedback);
router.post('/delete-message', ChatController_1.default.deleteMessage);
router.post('/update-message', ChatController_1.default.updateMessage);
router.put('/update', ChatController_1.default.update);
exports.default = router;
//# sourceMappingURL=chat.js.map