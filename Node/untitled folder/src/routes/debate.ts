import express from 'express';
import DebateController from '../controllers/DebateController';
import DebateStreamController from '../controllers/DebateStreamController';

const router = express.Router();

router.get('/index', DebateController.index);
router.get('/show/:debateId', DebateController.show);

router.post('/store', DebateController.store);
router.post('/update', DebateController.update);
router.post('/update-stream', DebateStreamController.updateStream);
router.post('/update-invited-users', DebateController.updateInvitedUsers);
router.post('/update-message', DebateController.updateMessage);
router.post('/update-bot-message', DebateController.updateBotMessage);
router.post('/leave-debate', DebateController.leaveDebate);
router.post('/read-all-messages', DebateController.markAsReadDebate);
router.post('/remove-user', DebateController.removeUserFromDebate);

export default router;
