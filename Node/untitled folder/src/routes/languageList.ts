import express from 'express';
import VoiceListsController from '../controllers/VoiceListsController';
import LanguageListController from '../controllers/LanguageListController';

const router = express.Router();

// router.get('/store', VoiceListsController.store);
router.get('/index', LanguageListController.index);

export default router;
