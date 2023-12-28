import express from 'express';
import multer from 'multer';
import DocumentSummarizationController from '../controllers/DocumentSummarizationController';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});


router.post('/generate', upload.single('file'), DocumentSummarizationController.generate);
router.post('/examMe', upload.single('file'), DocumentSummarizationController.examMe);

export default router;
