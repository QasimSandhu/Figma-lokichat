"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NotebookController_1 = __importDefault(require("../controllers/NotebookController"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
router.post('/store', NotebookController_1.default.store);
router.post('/index', NotebookController_1.default.index);
router.post('/destroy-by-user', NotebookController_1.default.destroyByUserId);
router.put('/update', NotebookController_1.default.update);
router.delete('/destroy/:notebookId', NotebookController_1.default.destroy);
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
});
router.post('/generateTextFromPdf', upload.single('file'), NotebookController_1.default.generateTextFromPdf);
exports.default = router;
//# sourceMappingURL=notebook.js.map