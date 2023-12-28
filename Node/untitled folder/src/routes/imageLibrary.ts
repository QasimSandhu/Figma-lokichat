import express from 'express';
import ImageLibraryController from '../controllers/ImageLibraryController';

const router = express.Router();

router.get('/index', ImageLibraryController.index);
router.post('/update', ImageLibraryController.update);

router.delete('/destroy/:Id', ImageLibraryController.destroy);

export default router;
