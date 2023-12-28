import express from 'express';
import ProfileController from '../controllers/ProfileController';
import { upload } from '../middleware/MulterMiddleware';
const router = express.Router();

router.post('/destroy', ProfileController.destroy);

router.put('/update', upload.single('image') ,ProfileController.update);
router.put('/update-password', ProfileController.updatePassword);

router.delete('/destroyUser', ProfileController.destroyUser);
router.get('/getUserProfile', ProfileController.getUserProfile);

router.post('/update-user-name', ProfileController.updateUserName);

export default router;