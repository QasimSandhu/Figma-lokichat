"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatListController_1 = __importDefault(require("../controllers/ChatListController"));
const router = express_1.default.Router();
router.get('/index', ChatListController_1.default.index);
router.get('/show', ChatListController_1.default.show);
router.get('/showByPagination', ChatListController_1.default.showByPagination);
router.post('/store', ChatListController_1.default.store);
router.post('/export', ChatListController_1.default.export);
exports.default = router;
//# sourceMappingURL=chatListRoutes.js.map