import express from 'express';
import SuperUserController from '../controllers/SuperUserController';

const router = express.Router();

router.get('/index', SuperUserController.index);
router.get('/show', SuperUserController.show);

router.post('/store', SuperUserController.store);
router.post('/update', SuperUserController.update);

export default router;
