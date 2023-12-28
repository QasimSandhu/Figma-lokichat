import express from 'express';
import ChatController from '../controllers/ChatController';
import ChatStreamController from '../controllers/ChatStreamController';

const router = express.Router();

router.get('/index', ChatController.index);
router.get('/indexByPagination', ChatController.indexByPagination);
router.get('/promptAdvisor', ChatController.promptAdvisor);

router.post('/store', ChatController.store);
router.post('/store-stream', ChatStreamController.storeStream);
router.post('/update-stream', ChatStreamController.updateStream);
router.post('/store-goal', ChatController.storeGoal);
router.post('/store-chat-list', ChatController.storeChatList);
router.post('/re-store', ChatController.reStore);
router.post('/show', ChatController.show);
router.post('/show-details', ChatController.showDetails);
router.post('/update-chat-list', ChatController.updateChatList)
router.post('/feedback', ChatController.feedback);
router.post('/delete-message', ChatController.deleteMessage);
router.post('/update-message', ChatController.updateMessage);

router.put('/update', ChatController.update);


export default router;
