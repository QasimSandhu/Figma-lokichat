"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LanguageListController_1 = __importDefault(require("../controllers/LanguageListController"));
const router = express_1.default.Router();
// router.get('/store', VoiceListsController.store);
router.get('/index', LanguageListController_1.default.index);
exports.default = router;
//# sourceMappingURL=languageList.js.map