import express from "express";
import GoalController from "../controllers/GoalController";

const router = express.Router();

router.get("/index", GoalController.index);
router.get("/indexByPagination", GoalController.indexByPagination);
router.get("/stats", GoalController.stats);

router.post("/store", GoalController.store);
router.post("/show", GoalController.show);

router.put("/update", GoalController.update);

router.delete("/destroy/:goalId", GoalController.destroy);

export default router;
