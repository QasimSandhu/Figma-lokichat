"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BuyMorePackageController_1 = __importDefault(require("../controllers/BuyMorePackageController"));
const router = express_1.default.Router();
router.post('/store', BuyMorePackageController_1.default.store);
router.get('/index', BuyMorePackageController_1.default.index);
router.get('/indexById', BuyMorePackageController_1.default.indexById);
exports.default = router;
//# sourceMappingURL=buyMorePackage.js.map