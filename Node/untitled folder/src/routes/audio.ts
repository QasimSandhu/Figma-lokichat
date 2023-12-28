import express from 'express';
import AudioController from '../controllers/AudioController';

const router = express.Router();

router.post('/store', AudioController.store);
router.post('/show', AudioController.show);
router.post('/update', AudioController.update);
router.delete('/destroy/:audioId', AudioController.destroy);

export default router;
