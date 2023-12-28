import express from 'express';
import DevicesController from '../controllers/DevicesController';

const router = express.Router();

router.get('/index', DevicesController.index);
router.post('/store', DevicesController.store);

router.delete('/destroy/:deviceId', DevicesController.destroy);
router.delete('/destroy-all', DevicesController.destroyAll);

export default router;
