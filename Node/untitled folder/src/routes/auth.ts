import express from 'express';
import authController from '../controllers/AuthController';

const router = express.Router();

router.get('/getUserById/:id', (req, res) => authController.getUserById(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));
router.post('/verify-refferral', (req, res) => authController.verifyReferralCode(req, res));
router.post('/request-otp', (req, res) => authController.requestOTP(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

router.post('/user/getProfile', authController.getUserProfile);
router.get('/user/referral-detail/:userId', authController.referralDetail);
router.get('/user/user-detail/:userId', authController.userDetail);
router.get('/user/referral-details/:userId', authController.referralDetails);
router.post('/user-invites', (req, res) => authController.userInviteCount(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

export default router;
