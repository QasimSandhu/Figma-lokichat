import express from 'express';
import StripeController from '../controllers/StripeController';

const router = express.Router();

router.get('/getAccountSetupLink', StripeController.getSetupAccountLink);
router.get('/getPendingTransactions', StripeController.getPendingTransactions);
router.get('/getTransactionHistory', StripeController.getTransactionHistory);
router.post('/transferToConnectAccount', StripeController.transferToConnectAccount);
router.get('/getConnectAccountLoginLink', StripeController.getStripeConnectAccountLoginLink);
router.get('/getConnectAccountDetails', StripeController.getStripeConnectAccountDetails);

export default router;
