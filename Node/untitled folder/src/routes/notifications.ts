import express from 'express';
import NotificationsController from '../controllers/NotificationsController';

const router = express.Router();

router.get('/index', NotificationsController.index);
router.post('/store', NotificationsController.store);

router.post('/update', NotificationsController.update);
router.delete('/destroy/:notificationId', NotificationsController.destroy);
router.post('/read', NotificationsController.read);
router.post('/send-email', NotificationsController.sendMail);


export default router;
