import express from 'express';
import SubscriptionController from '../controllers/SubscriptionController';

const router = express.Router();

router.post('/store', SubscriptionController.store);
router.get('/index', SubscriptionController.index);
router.post('/plan-subscription', SubscriptionController.planSubscription);
router.post('/create-payment-intent', SubscriptionController.createPaymentIntent);
router.get('/billingPortal', SubscriptionController.billingPortal);
router.post('/verifyReferralCode', SubscriptionController.verifyReferralCode);
export default router;
