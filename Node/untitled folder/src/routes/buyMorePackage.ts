import express from 'express';
import BuyMorePackageController from '../controllers/BuyMorePackageController';

const router = express.Router();

router.post('/store', BuyMorePackageController.store);
router.get('/index', BuyMorePackageController.index);
router.get('/indexById', BuyMorePackageController.indexById);

export default router;
