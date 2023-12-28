import express from 'express';
import InvitedSuperUserController from '../controllers/InvitedSuperUserController';

const router = express.Router();

router.post('/invite-superUsers', (req, res) => InvitedSuperUserController.inviteSuperUser(req, res));

export default router;
