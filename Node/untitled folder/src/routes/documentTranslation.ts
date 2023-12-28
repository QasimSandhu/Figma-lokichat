import express from "express";
import DocumentTranslationController from "../controllers/DocumentTranslationController";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory as a buffer

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 50 MB limit (adjust as needed)
  },
});

router.post("/store", upload.single("file"), DocumentTranslationController.store);

export default router;
