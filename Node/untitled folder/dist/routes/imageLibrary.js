"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ImageLibraryController_1 = __importDefault(require("../controllers/ImageLibraryController"));
const router = express_1.default.Router();
router.get('/index', ImageLibraryController_1.default.index);
router.post('/update', ImageLibraryController_1.default.update);
router.delete('/destroy/:Id', ImageLibraryController_1.default.destroy);
exports.default = router;
//# sourceMappingURL=imageLibrary.js.map