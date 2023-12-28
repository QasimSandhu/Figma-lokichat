"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GoalController_1 = __importDefault(require("../controllers/GoalController"));
const router = express_1.default.Router();
router.get("/index", GoalController_1.default.index);
router.get("/indexByPagination", GoalController_1.default.indexByPagination);
router.get("/stats", GoalController_1.default.stats);
router.post("/store", GoalController_1.default.store);
router.post("/show", GoalController_1.default.show);
router.put("/update", GoalController_1.default.update);
router.delete("/destroy/:goalId", GoalController_1.default.destroy);
exports.default = router;
//# sourceMappingURL=goal.js.map