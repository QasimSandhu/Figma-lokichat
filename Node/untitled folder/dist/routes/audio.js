"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AudioController_1 = __importDefault(require("../controllers/AudioController"));
const router = express_1.default.Router();
router.post('/store', AudioController_1.default.store);
router.post('/show', AudioController_1.default.show);
router.post('/update', AudioController_1.default.update);
router.delete('/destroy/:audioId', AudioController_1.default.destroy);
exports.default = router;
//# sourceMappingURL=audio.js.map