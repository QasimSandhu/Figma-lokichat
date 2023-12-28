import express from 'express';
import stripeWebhookController from '../controllers/stripeWebhookController';

const router = express.Router();

router.post('/stripeWebhook',stripeWebhookController.stripeWebhook);

export default router;