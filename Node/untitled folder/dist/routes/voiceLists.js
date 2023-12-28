"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VoiceListsController_1 = __importDefault(require("../controllers/VoiceListsController"));
const router = express_1.default.Router();
// router.get('/store', VoiceListsController.store);
router.get('/index', VoiceListsController_1.default.index);
exports.default = router;
//# sourceMappingURL=voiceLists.js.map