import express from 'express';
import NotebookController from '../controllers/NotebookController';
import multer from 'multer';

const router = express.Router();

router.post('/store', NotebookController.store);
router.post('/index', NotebookController.index);
router.post('/destroy-by-user', NotebookController.destroyByUserId);

router.put('/update', NotebookController.update);

router.delete('/destroy/:notebookId', NotebookController.destroy);
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});


router.post('/generateTextFromPdf', upload.single('file'), NotebookController.generateTextFromPdf);
export default router;
