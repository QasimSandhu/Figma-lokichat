"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SuperUserController_1 = __importDefault(require("../controllers/SuperUserController"));
const router = express_1.default.Router();
router.get('/index', SuperUserController_1.default.index);
router.get('/show', SuperUserController_1.default.show);
router.post('/store', SuperUserController_1.default.store);
router.post('/update', SuperUserController_1.default.update);
exports.default = router;
//# sourceMappingURL=superUser.js.map