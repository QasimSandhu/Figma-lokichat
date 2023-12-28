"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfileController_1 = __importDefault(require("../controllers/ProfileController"));
const MulterMiddleware_1 = require("../middleware/MulterMiddleware");
const router = express_1.default.Router();
router.post('/destroy', ProfileController_1.default.destroy);
router.put('/update', MulterMiddleware_1.upload.single('image'), ProfileController_1.default.update);
router.put('/update-password', ProfileController_1.default.updatePassword);
router.delete('/destroyUser', ProfileController_1.default.destroyUser);
router.get('/getUserProfile', ProfileController_1.default.getUserProfile);
router.post('/update-user-name', ProfileController_1.default.updateUserName);
exports.default = router;
//# sourceMappingURL=profile.js.map