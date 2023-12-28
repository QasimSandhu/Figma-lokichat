"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const router = express_1.default.Router();
router.get('/getUserById/:id', (req, res) => AuthController_1.default.getUserById(req, res));
router.post('/login', (req, res) => AuthController_1.default.login(req, res));
router.post('/register', (req, res) => AuthController_1.default.register(req, res));
router.post('/verify-otp', (req, res) => AuthController_1.default.verifyOtp(req, res));
router.post('/verify-refferral', (req, res) => AuthController_1.default.verifyReferralCode(req, res));
router.post('/request-otp', (req, res) => AuthController_1.default.requestOTP(req, res));
router.post('/reset-password', (req, res) => AuthController_1.default.resetPassword(req, res));
router.post('/user/getProfile', AuthController_1.default.getUserProfile);
router.get('/user/referral-detail/:userId', AuthController_1.default.referralDetail);
router.get('/user/user-detail/:userId', AuthController_1.default.userDetail);
router.get('/user/referral-details/:userId', AuthController_1.default.referralDetails);
router.post('/user-invites', (req, res) => AuthController_1.default.userInviteCount(req, res));
router.post('/refresh-token', (req, res) => AuthController_1.default.refreshToken(req, res));
exports.default = router;
//# sourceMappingURL=auth.js.map