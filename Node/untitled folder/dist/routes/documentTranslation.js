"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DocumentTranslationController_1 = __importDefault(require("../controllers/DocumentTranslationController"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Store the file in memory as a buffer
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1000 * 1024 * 1024, // 50 MB limit (adjust as needed)
    },
});
router.post("/store", upload.single("file"), DocumentTranslationController_1.default.store);
exports.default = router;
//# sourceMappingURL=documentTranslation.js.map