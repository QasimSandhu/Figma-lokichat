"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("../services/AuthService"));
const LoginRequest_1 = require("../requests/user/LoginRequest");
const RegisterRequest_1 = require("../requests/user/RegisterRequest");
const OptRequest_1 = require("../requests/user/OptRequest");
const class_validator_1 = require("class-validator");
const LoginResource_1 = __importDefault(require("../resources/Auth/LoginResource"));
const RegisterResource_1 = __importDefault(require("../resources/Auth/RegisterResource"));
const RequestOtpResource_1 = __importDefault(require("../resources/Auth/RequestOtpResource"));
const VerifyOtpResource_1 = __importDefault(require("../resources/Auth/VerifyOtpResource"));
const lodash_1 = require("lodash");
const CustomError_1 = __importDefault(require("..//middleware/CustomError"));
const ReferralResource_1 = __importDefault(require("../resources/Auth/ReferralResource"));
const requestHelper_1 = require("../lib/helpers/requestHelper");
const RefreshTokenResource_1 = __importDefault(require("../resources/Auth/RefreshTokenResource"));
const GoogleLoginResource_1 = __importDefault(require("../resources/Auth/GoogleLoginResource"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginRequest = new LoginRequest_1.LoginRequest(req);
                const errors = yield (0, class_validator_1.validate)(loginRequest);
                if (errors.length > 0) {
                    const errorResponse = {};
                    errors.forEach((error) => {
                        Object.keys(error.constraints).forEach((key) => {
                            errorResponse[error.property] = error.constraints[key];
                        });
                    });
                    return res.status(422).json({ errors: errorResponse });
                }
                const result = yield AuthService_1.default.login(req.body);
                if ((0, lodash_1.isEmpty)(result)) {
                    return res.status(401).json(new LoginResource_1.default(result, "Invalid email or password", 401));
                }
                else if (!(result === null || result === void 0 ? void 0 : result.isReferralVerified)) {
                    return res.status(500).json(new GoogleLoginResource_1.default(result, "User Enter Valid Referral code to login", 401));
                }
                else {
                    return res.status(200).json(new LoginResource_1.default(result, "User loggedIN successfully", 200));
                }
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    return res.status(error.statusCode).json(new LoginResource_1.default(null, error.message, error.statusCode));
                }
                return res.status(500).json(new LoginResource_1.default(null, error.message, 500));
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registerRequest = new RegisterRequest_1.RegisterRequest(req);
                const errors = yield (0, class_validator_1.validate)(registerRequest);
                if (errors.length > 0) {
                    const errorResponse = {};
                    errors.forEach((error) => {
                        Object.keys(error.constraints).forEach((key) => {
                            errorResponse[error.property] = error.constraints[key];
                        });
                    });
                    return res.status(422).json({ errors: errorResponse });
                }
                const result = yield AuthService_1.default.register(req.body);
                return res.status(200).json(new RegisterResource_1.default(result));
            }
            catch (error) {
                return res.status(500).json(new RegisterResource_1.default(null, error.message));
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginRequest = new OptRequest_1.OtpRequest(req);
                const errors = yield (0, class_validator_1.validate)(loginRequest);
                if (errors.length > 0) {
                    const errorResponse = {};
                    errors.forEach((error) => {
                        Object.keys(error.constraints).forEach((key) => {
                            errorResponse[error.property] = error.constraints[key];
                        });
                    });
                    return res.status(422).json({ errors: errorResponse });
                }
                const result = yield AuthService_1.default.verifyOtp(req.body);
                return res.status(200).json(new VerifyOtpResource_1.default(result));
            }
            catch (error) {
                return res.status(500).json(new LoginResource_1.default(null, error.message));
            }
        });
    }
    verifyReferralCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield AuthService_1.default.verifyReferralCode(req.body);
                return res.status(200).json(new LoginResource_1.default(result, "User loggedIN successfully", 200));
            }
            catch (error) {
                return res.status(500).json(new LoginResource_1.default(null, error.message));
            }
        });
    }
    requestOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginRequest = new OptRequest_1.RequestOTPRequest(req);
                const errors = yield (0, class_validator_1.validate)(loginRequest);
                if (errors.length > 0) {
                    const errorResponse = {};
                    errors.forEach((error) => {
                        Object.keys(error.constraints).forEach((key) => {
                            errorResponse[error.property] = error.constraints[key];
                        });
                    });
                    return res.status(422).json({ errors: errorResponse });
                }
                const result = yield AuthService_1.default.requestOTP(req.body);
                return res.status(200).json(new RequestOtpResource_1.default(result, 'OTP sent successfully'));
            }
            catch (error) {
                return res.status(500).json(new RequestOtpResource_1.default(null, error.message));
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginRequest = new OptRequest_1.ResetPasswordRequest(req);
                const errors = yield (0, class_validator_1.validate)(loginRequest);
                if (errors.length > 0) {
                    const errorResponse = {};
                    errors.forEach((error) => {
                        Object.keys(error.constraints).forEach((key) => {
                            errorResponse[error.property] = error.constraints[key];
                        });
                    });
                    return res.status(422).json({ errors: errorResponse });
                }
                const result = yield AuthService_1.default.resetPassword(req.body);
                return res.status(200).json(new LoginResource_1.default(result));
            }
            catch (error) {
                return res.status(500).json(new RequestOtpResource_1.default(null, error.message));
            }
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const result = yield AuthService_1.default.getUserProfileByAccessToken(body);
                //if(!result?.isReferralVerified){
                //  return res.status(500).json(new GoogleLoginResource(result, "User Enter Valid Referral code to login", 401));
                //}
                //else {
                return res.status(200).json(new LoginResource_1.default(result));
                //}
            }
            catch (error) {
                return res.status(500).json(new LoginResource_1.default(null, error));
            }
        });
    }
    referralDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AuthService_1.default.referralDetail, ReferralResource_1.default);
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AuthService_1.default.getUserById, null);
        });
    }
    referralDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AuthService_1.default.referralDetails, ReferralResource_1.default);
        });
    }
    userDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AuthService_1.default.userDetail, ReferralResource_1.default);
        });
    }
    userInviteCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, AuthService_1.default.userInviteCount, ReferralResource_1.default);
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, LoginRequest_1.RefreshTokenRequest, AuthService_1.default.refreshToken, RefreshTokenResource_1.default);
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map