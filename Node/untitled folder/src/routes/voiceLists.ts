import express from 'express';
import VoiceListsController from '../controllers/VoiceListsController';

const router = express.Router();

// router.get('/store', VoiceListsController.store);
router.get('/index', VoiceListsController.index);

export default router;
