"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const DocumentSummarizationController_1 = __importDefault(require("../controllers/DocumentSummarizationController"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
});
router.post('/generate', upload.single('file'), DocumentSummarizationController_1.default.generate);
router.post('/examMe', upload.single('file'), DocumentSummarizationController_1.default.examMe);
exports.default = router;
//# sourceMappingURL=documentSummary.js.map