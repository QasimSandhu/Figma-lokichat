"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DevicesController_1 = __importDefault(require("../controllers/DevicesController"));
const router = express_1.default.Router();
router.get('/index', DevicesController_1.default.index);
router.post('/store', DevicesController_1.default.store);
router.delete('/destroy/:deviceId', DevicesController_1.default.destroy);
router.delete('/destroy-all', DevicesController_1.default.destroyAll);
exports.default = router;
//# sourceMappingURL=devices.js.map