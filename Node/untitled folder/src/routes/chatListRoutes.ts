import express from 'express';
import ChatListController from '../controllers/ChatListController';

const router = express.Router();

router.get('/index', ChatListController.index);
router.get('/show', ChatListController.show);
router.get('/showByPagination', ChatListController.showByPagination);

router.post('/store', ChatListController.store);
router.post('/export', ChatListController.export);

export default router;
