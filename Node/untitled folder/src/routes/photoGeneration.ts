import express from 'express';
import PhotoGenerationController from '../controllers/PhotoGenerationController';

const router = express.Router();

router.post('/store', PhotoGenerationController.store);
router.post('/update', PhotoGenerationController.update);
router.post('/fetch-queued-photo', PhotoGenerationController.fetchQueuedPhoto);

export default router;
