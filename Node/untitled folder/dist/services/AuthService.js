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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config/config"));
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const generateOtp_1 = require("../lib/helpers/generateOtp");
const axios_1 = __importDefault(require("axios"));
const CustomError_1 = __importDefault(require("../middleware/CustomError"));
const generateToken_1 = require("../lib/helpers/generateToken");
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const DevicesServices_1 = __importDefault(require("./DevicesServices"));
const Compain_1 = __importDefault(require("../models/Compain"));
const lodash_1 = require("lodash");
const user_1 = require("../lib/constants/user");
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const SocketIO_1 = require("../classes/SocketIO");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const sendGridEmail_1 = require("../lib/helpers/sendGridEmail");
const mailTypes_1 = require("../lib/constants/mailTypes");
const utils_1 = require("../lib/helpers/utils");
const invitedSuperUser_1 = __importDefault(require("../models/invitedSuperUser"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const socket = new SocketIO_1.Socket();
class AuthService {
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, os, browserName, browserVersion, ipAddress, isMobile, mobileId, mobileName, type } = req;
                if (isMobile) {
                    if (!mobileId || !mobileName) {
                        throw new CustomError_1.default("Device information is required to login", 401);
                    }
                }
                const socialUser = yield User_1.default.findOne({
                    email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
                    isVerified: true,
                });
                if (socialUser && (socialUser.gmailProviderId || socialUser.appleProviderId) && !socialUser.password)
                    throw new CustomError_1.default("Account already exists with a different login method. Please sign in using the original method.", 401);
                // Find user by email
                const user = yield User_1.default.findOne({
                    email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
                    isVerified: true
                });
                if (!user)
                    throw new CustomError_1.default("User does not exist with this email address.", 401);
                if (user && !(user === null || user === void 0 ? void 0 : user.isReferralVerified) && !type) {
                    return user;
                }
                // if(user && !user?.userName && !type){
                //   return user;
                // }
                //N6TTYJIME
                if (user && user.isDeleted)
                    throw new Error("User does not exists");
                if (!user.isVerified)
                    throw new CustomError_1.default("Your account is not verified yet.", 403);
                // Compare password hashes
                const match = yield bcryptjs_1.default.compare(password, user.password);
                if (!match)
                    throw new CustomError_1.default("Invalid email or password", 401);
                if (type === "referral") {
                    user.isReferralVerified = true;
                }
                yield user.save();
                // save logged in device information
                const data = {
                    userId: user._id,
                    os,
                    ipAddress,
                    browserName,
                    browserVersion,
                    isMobile,
                    mobileId,
                    mobileName,
                };
                const savedDevice = yield DevicesServices_1.default.saveDeviceIntoDB(data, false);
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({
                    userId: user._id,
                    deviceId: savedDevice._id,
                    role: user.role || user_1.USER_ROLES.USER,
                }, config_1.default.jwtSecretKey, { expiresIn: config_1.default.jwtTokenExpiration });
                const generatedRefreshToken = yield this.saveRefreshToken(user);
                return Object.assign(Object.assign({}, ObjectDestructurer_1.default.distruct(user)), { token, refreshToken: generatedRefreshToken });
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            const generatedRefreshToken = yield (0, generateToken_1.generateRefreshToken)();
            const existingRefreshToken = RefreshToken_1.default.findOne({ user: user._id });
            if (existingRefreshToken) {
                const refreshToken = new RefreshToken_1.default({
                    user: user._id,
                    token: generatedRefreshToken,
                });
                refreshToken.save();
                token = refreshToken.token;
            }
            else {
                existingRefreshToken.token = generatedRefreshToken;
                yield existingRefreshToken.save();
                token = existingRefreshToken.token;
            }
            return token;
        });
    }
    register(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, email, password, referalInvite, campainId } = req;
                if (!userName || !email) {
                    throw new Error("Username and Email both are required");
                }
                const checkUserIsInvited = yield invitedSuperUser_1.default.findOne({ email: email });
                // if(!checkUserIsInvited){
                //   throw new Error("Please use valid email")
                // }
                let referringUser;
                let compaign;
                let referringUserFromAdmin;
                if (referalInvite) {
                    // Find the referring user by their referral code
                    referringUser = yield User_1.default.findOne({ referralCode: referalInvite });
                    referringUserFromAdmin = yield invitedSuperUser_1.default.findOne({ invitationCode: referalInvite });
                    // if (!referringUser || !referringUserFromAdmin) {
                    //   throw new Error("Referral code not found.");
                    // }
                }
                if (campainId) {
                    // Find the comapign  by their comapign name
                    compaign = yield Compain_1.default.findOne({ _id: campainId });
                    if (!compaign)
                        throw new Error("Compaign not found.");
                }
                const user = yield User_1.default.findOne({
                    email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
                    isVerified: true
                });
                if (user) {
                    if ((user === null || user === void 0 ? void 0 : user.isDeleted) === false && user.isVerified === true && !user.password) {
                        throw new Error("Account already exists with a different login method. Please sign in using the original method.");
                    }
                    else if ((user === null || user === void 0 ? void 0 : user.isDeleted) === false && user.isVerified === true) {
                        throw new Error("You are already registered");
                    }
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const customer = yield stripe.customers.create({
                    email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
                    name: userName,
                    description: "Loki Chat",
                });
                const otp = (0, generateOtp_1.generateOTP)(); // Implement the function to generate OTP
                const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires after 10 minutes
                const referralCode = (0, utils_1.generateRandomString)(9);
                let updatedUser;
                if (!user) {
                    const newUser = new User_1.default({
                        userName,
                        email: email.toLowerCase(),
                        otpExpiresAt,
                        otp: Number(otp),
                        password: hashedPassword,
                        stripeId: customer === null || customer === void 0 ? void 0 : customer.id,
                        referralCode: referralCode,
                        invitedReferralCode: referalInvite,
                        campaignId: compaign === null || compaign === void 0 ? void 0 : compaign._id,
                    });
                    if (referringUser) {
                        referringUser.invitedUsers.push(newUser._id);
                        yield referringUser.save();
                    }
                    if (referringUserFromAdmin) {
                        newUser.role = 'super-user';
                    }
                    updatedUser = yield newUser.save();
                }
                else if (user) {
                    if (user === null || user === void 0 ? void 0 : user.isDeleted)
                        user.isDeleted = false;
                    user.provider = null;
                    user.providerId = null;
                    user.userName = userName;
                    user.otpExpiresAt = otpExpiresAt;
                    user.otp = Number(otp);
                    user.password = hashedPassword;
                    user.stripeId = customer === null || customer === void 0 ? void 0 : customer.id;
                    user.referralCode = referralCode;
                    user.campaignId = (compaign === null || compaign === void 0 ? void 0 : compaign._id) || null;
                    updatedUser = yield user.save();
                }
                if (compaign) {
                    const rcUser = (_b = (_a = compaign === null || compaign === void 0 ? void 0 : compaign._doc) === null || _a === void 0 ? void 0 : _a.creator) !== null && _b !== void 0 ? _b : compaign === null || compaign === void 0 ? void 0 : compaign.creator;
                    const notification = {
                        title: "Campaign User Registered",
                        user: rcUser,
                        name: notificationsTypes_1.SOCKET_EVENT_TYPES.CAMPAIGN_INVITE,
                        message: `${userName} has singed up with your campaign.`,
                        from: (_c = updatedUser._id) !== null && _c !== void 0 ? _c : (_d = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._doc) === null || _d === void 0 ? void 0 : _d._id,
                        receivers: [rcUser],
                        profileUrl: (_g = (_e = updatedUser.profileUrl) !== null && _e !== void 0 ? _e : (_f = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._doc) === null || _f === void 0 ? void 0 : _f.profileUrl) !== null && _g !== void 0 ? _g : null
                    };
                    const notifications = new Notifications_1.default(notification);
                    yield notifications.save();
                    socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.CAMPAIGN_INVITE, {
                        isNotification: true,
                        userIds: [rcUser]
                    });
                }
                else if (referalInvite) {
                    const rcUser = (_j = (_h = referringUser === null || referringUser === void 0 ? void 0 : referringUser._doc) === null || _h === void 0 ? void 0 : _h._id) !== null && _j !== void 0 ? _j : referringUser === null || referringUser === void 0 ? void 0 : referringUser._id;
                    const notification = {
                        title: "Invitation Accepted",
                        user: rcUser,
                        name: notificationsTypes_1.SOCKET_EVENT_TYPES.REFFERAL_INVITE,
                        message: `${userName} has singed up with your invitation link.`,
                        from: (_k = updatedUser._id) !== null && _k !== void 0 ? _k : (_l = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._doc) === null || _l === void 0 ? void 0 : _l._id,
                        receivers: [rcUser],
                    };
                    const notifications = new Notifications_1.default(notification);
                    yield notifications.save();
                    socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.REFFERAL_INVITE, {
                        isNotification: true,
                        userIds: [rcUser]
                    });
                }
                yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.OTP_MAIL, { name: userName, email: email, otp: otp }, email);
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifyOtp(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req;
                // Find user by email
                const user = yield User_1.default.findOne({
                    email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
                    password: { $ne: null }
                });
                if (!user)
                    return false;
                // Check if the OTP has expired
                if (new Date() > user.otpExpiresAt)
                    throw new Error("Otp has expired!");
                // Check if the provided OTP matches the saved OTP
                if (otp != user.otp)
                    throw new Error("Invalid OTP");
                // If OTP is valid, mark it as verified
                user.isOtpVerified = true;
                user.isVerified = true;
                yield user.save();
                yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.WELCOME_MAIL, { name: user === null || user === void 0 ? void 0 : user.userName }, email);
                return Object.assign({}, ObjectDestructurer_1.default.distruct(user));
            }
            catch (err) {
                throw err;
            }
        });
    }
    verifyReferralCode(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, appleProviderId, gmailProviderId, referralCode, os, browserName, browserVersion, ipAddress, isMobile, mobileId, mobileName, type } = req;
                let user = null;
                if (appleProviderId) {
                    user = yield User_1.default.findOne({ appleProviderId: appleProviderId });
                }
                else if (gmailProviderId) {
                    user = yield User_1.default.findOne({ gmailProviderId: gmailProviderId });
                }
                else if (email) {
                    user = yield User_1.default.findOne({ email: email === null || email === void 0 ? void 0 : email.toLowerCase() });
                }
                const comapaign = yield Compain_1.default.findOne({ referralCode: referralCode });
                const userReferral = yield User_1.default.findOne({ referralCode: referralCode });
                const invitedBByAdmin = yield invitedSuperUser_1.default.findOne({ invitationCode: referralCode });
                if (!user) {
                    throw new Error("user not found");
                }
                ;
                if (!comapaign && !invitedBByAdmin && !userReferral)
                    throw new Error("Invalid Referral code");
                user.isReferralVerified = true;
                user.invitedReferralCode = referralCode;
                if (comapaign)
                    user.campaignId = (_a = comapaign._id) !== null && _a !== void 0 ? _a : (_b = comapaign === null || comapaign === void 0 ? void 0 : comapaign._doc) === null || _b === void 0 ? void 0 : _b._id;
                yield user.save();
                if (userReferral && !userReferral.invitedUsers.includes(user._id)) {
                    userReferral.invitedUsers.push(user._id);
                    //userReferral.subscribedUser.push(user._id);
                    userReferral.inviteUserCount = userReferral.invitedUsers.length;
                    yield userReferral.save();
                }
                const data = {
                    userId: user._id,
                    os,
                    ipAddress,
                    browserName,
                    browserVersion,
                    isMobile,
                    mobileId,
                    mobileName,
                };
                const savedDevice = yield DevicesServices_1.default.saveDeviceIntoDB(data, false);
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({
                    userId: user._id,
                    deviceId: savedDevice._id,
                    role: user.role || user_1.USER_ROLES.USER,
                }, config_1.default.jwtSecretKey, { expiresIn: config_1.default.jwtTokenExpiration });
                const generatedRefreshToken = yield this.saveRefreshToken(user);
                // return { ...ObjectManipulator.distruct(user),token,refreshToken:generatedRefreshToken };
                return Object.assign(Object.assign({}, ObjectDestructurer_1.default.distruct(user)), { token, refreshToken: generatedRefreshToken });
            }
            catch (err) {
                throw err;
            }
        });
    }
    requestOTP(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = body;
                // Find user by email
                const user = yield User_1.default.findOne({ email: email === null || email === void 0 ? void 0 : email.toLowerCase() });
                if (!user)
                    throw new Error("No user found with this email");
                if ((user === null || user === void 0 ? void 0 : user.isDeleted) || !(user === null || user === void 0 ? void 0 : user.password))
                    throw new Error("Please continue with your social account");
                const otp = (0, generateOtp_1.generateOTP)();
                const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
                // If OTP is valid, mark it as verified
                user.isOtpVerified = false;
                user.otp = Number(otp);
                user.otpExpiresAt = resetTokenExpiresAt;
                yield user.save();
                yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.OTP_MAIL, { name: user === null || user === void 0 ? void 0 : user.userName, email: email, otp: otp }, email);
                return {
                    id: user._id,
                    email,
                    otpExpiresAt: user.otpExpiresAt,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPassword(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword, confirmNewPassword } = body;
                if (newPassword !== confirmNewPassword)
                    throw new Error("New password did not match with confirmed password");
                const user = yield User_1.default.findOne({
                    email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
                    password: { $ne: null },
                });
                if (!user)
                    throw new Error("No user found with this email");
                if ((user === null || user === void 0 ? void 0 : user.isDeleted) === true)
                    throw new Error("No user found with this email");
                if (!user.isOtpVerified)
                    throw new Error("Your Otp is not verified!");
                if (new Date() > user.otpExpiresAt)
                    throw new Error("Your Otp is expired!");
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                user.password = hashedPassword;
                yield user.save();
                return Object.assign({}, ObjectDestructurer_1.default.distruct(user));
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getUserProfileByAccessToken(body) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, provider, referalInvite, os, ipAddress, browserName, browserVersion, isMobile, mobileId, mobileName, type } = body;
                if (isMobile) {
                    if (!mobileId || !mobileName) {
                        throw new CustomError_1.default("Device information is required to login", 401);
                    }
                }
                const data = { provider };
                let user;
                let referringUser;
                let googleResult;
                if (referalInvite) {
                    // Find the referring user by their referral code
                    referringUser = yield User_1.default.findOne({ referralCode: referalInvite });
                    if (!referringUser) {
                        throw new Error("Referring user not found.");
                    }
                }
                const referralCode = (0, utils_1.generateRandomString)(9);
                if (provider == user_1.SOCIAL_AUTH.GOOGLE) {
                    const result = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
                    googleResult = result;
                    const { data: responseData } = result;
                    const registeredUser = yield User_1.default.findOne({
                        email: responseData.email,
                        gmailProviderId: null,
                        appleProviderId: null,
                        isVerified: true
                    });
                    if (registeredUser) {
                        throw new CustomError_1.default("Account already exists with a different login method. Please sign in using the original method.", 401);
                    }
                    data.id = responseData.id;
                    data.email = responseData.email;
                    data.userName = responseData.given_name;
                    user = yield User_1.default.findOne({ email: (_a = data.email) === null || _a === void 0 ? void 0 : _a.toLowerCase(), gmailProviderId: data.id });
                    if (user && !(user === null || user === void 0 ? void 0 : user.isReferralVerified) && !type) {
                        // throw new Error("Enter Valid Referral code to login.");
                        return user;
                    }
                    // if(user && !user?.userName){
                    //   return user;
                    // }
                }
                else if (provider == user_1.SOCIAL_AUTH.APPLE) {
                    const idToken = jsonwebtoken_1.default.decode(token);
                    console.log({ idToken });
                    data.id = idToken.sub;
                    data.email = idToken === null || idToken === void 0 ? void 0 : idToken.email;
                    data.userName = idToken === null || idToken === void 0 ? void 0 : idToken.given_name;
                    const registeredUser = yield User_1.default.findOne({
                        email: data.email,
                        gmailProviderId: null,
                        appleProviderId: null,
                        isVerified: true
                    });
                    if (registeredUser) {
                        throw new CustomError_1.default("Account already exists with a different login method. Please sign in using the original method.", 401);
                    }
                    if (data.email) {
                        user = yield User_1.default.findOne({
                            email: data.email,
                            appleProvider: user_1.SOCIAL_AUTH.APPLE,
                        });
                        if (user && !(user === null || user === void 0 ? void 0 : user.isReferralVerified) && !type) {
                            return user;
                        }
                        // if(user && !user?.userName){
                        //   return user;
                        // }
                    }
                    else {
                        user = yield User_1.default.findOne({
                            appleProviderId: data.id,
                            appleProvider: user_1.SOCIAL_AUTH.APPLE,
                        });
                        if (user && !(user === null || user === void 0 ? void 0 : user.isReferralVerified) && !type) {
                            // throw new Error("Enter Valid Referral code to login.");
                            return user;
                        }
                        // if(user && !user?.userName){
                        //   return user;
                        // }
                    }
                }
                else
                    throw new Error("Invalid Provider");
                const customer = yield stripe.customers.create({
                    email: (_b = data.email) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                    name: data.userName,
                    description: "Loki Chat",
                });
                if (!user) {
                    // User does not exist, create new user
                    user = new User_1.default({
                        userName: data.userName || null,
                        email: ((_c = data === null || data === void 0 ? void 0 : data.email) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || null,
                        isVerified: true,
                        stripeId: customer === null || customer === void 0 ? void 0 : customer.id,
                        referralCode: referralCode,
                        invitedReferralCode: referalInvite,
                        isReferralVerified: false,
                    });
                    //console.log({data}); 
                    if (data.provider === user_1.SOCIAL_AUTH.GOOGLE) {
                        user.gmailProvider = data.provider;
                        user.gmailProviderId = data.id;
                        user.profileUrl = (_d = googleResult === null || googleResult === void 0 ? void 0 : googleResult.data) === null || _d === void 0 ? void 0 : _d.picture;
                    }
                    else if (data.provider === user_1.SOCIAL_AUTH.APPLE) {
                        user.appleProvider = data.provider;
                        user.appleProviderId = data.id;
                    }
                    //console.log(googleResult, user, " google and user respectively");
                    yield user.save();
                    if (user && !(user === null || user === void 0 ? void 0 : user.isReferralVerified) && !type) {
                        return user;
                    }
                    // if(user && !user?.userName){
                    //   return user;
                    // }
                    if (referringUser) {
                        referringUser.invitedUsers.push(user._id);
                        yield referringUser.save();
                    }
                }
                else if (user && provider === user_1.SOCIAL_AUTH.GOOGLE) {
                    // here will have to manage google
                    user.gmailProvider = user_1.SOCIAL_AUTH.GOOGLE;
                    user.gmailProviderId = data.id;
                    user.isDeleted = false;
                    user.isVerified = true;
                    yield user.save();
                }
                else if (user && provider === user_1.SOCIAL_AUTH.APPLE) {
                    // here will have to manage apple
                    user.appleProvider = user_1.SOCIAL_AUTH.APPLE;
                    user.appleProviderId = data.id;
                    user.isDeleted = false;
                    user.isVerified = true;
                    yield user.save();
                }
                // save logged in device information
                const devicePayload = {
                    userId: user._id,
                    os,
                    ipAddress,
                    browserName,
                    browserVersion,
                    isMobile,
                    mobileId,
                    mobileName,
                };
                const savedDevice = yield DevicesServices_1.default.saveDeviceIntoDB(devicePayload, false);
                // Create JWT token
                const jwtToken = jsonwebtoken_1.default.sign({
                    userId: user._id,
                    deviceId: savedDevice._id,
                    role: user.role || user_1.USER_ROLES.USER,
                }, config_1.default.jwtSecretKey, { expiresIn: config_1.default.jwtTokenExpiration });
                const refreshToken = yield this.saveRefreshToken(user);
                return {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    token: jwtToken,
                    refreshToken,
                    bio: user.bio,
                    subscription: user.subscription,
                    profileUrl: user.profileUrl,
                    appleProviderId: user.appleProviderId,
                    gmailProviderId: user.gmailProviderId,
                    referralCode: user.referralCode,
                    invitedReferralCode: user.invitedReferralCode,
                    subscribedDate: user.subscribedDate,
                    isReferralVerified: user.isReferralVerified
                };
            }
            catch (err) {
                throw ((_e = err.response) === null || _e === void 0 ? void 0 : _e.data.message) || err.message;
            }
        });
    }
    referralDetail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                // Fetch the user by some identifier, e.g., req.user.id, which represents the current user
                const currentUser = yield User_1.default.findById(userId)
                    .populate({
                    path: "invitedUsers",
                    select: "userName email _id profileUrl", // Specify the fields you want to populate
                })
                    .exec();
                if (!currentUser) {
                    throw new Error("User not found");
                }
                const invitedUsers = currentUser.invitedUsers;
                return invitedUsers;
            }
            catch (err) {
                console.error(err);
                throw new Error("Something went wrong");
            }
        });
    }
    getUserById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // Fetch the user by some identifier, e.g., req.user.id, which represents the current user
                const currentUser = yield User_1.default.findById(id);
                if (!currentUser) {
                    throw new Error("User not found");
                }
                return currentUser;
            }
            catch (err) {
                console.error(err);
                throw new Error("Something went wrong");
            }
        });
    }
    referralDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            // Fetch the user by some identifier, e.g., req.user.id, which represents the current user
            const currentUser = yield User_1.default.findById(userId)
                .populate({
                path: "invitedUsers",
                select: "userName email _id profileUrl subscription", // Specify the fields you want to populate
            })
                .exec();
            if (!currentUser)
                throw new Error("User not found");
            const returnedObject = {};
            returnedObject.loggedInUsersCount = (0, lodash_1.size)(currentUser.invitedUsers) || 0;
            returnedObject.loggedInUsers = currentUser.invitedUsers;
            returnedObject.subscribedUserCount = (0, lodash_1.size)(currentUser.subscribedUser) || 0;
            returnedObject.inviteUserCount = currentUser.inviteUserCount;
            returnedObject.subscriptionsLeft = 5 - (0, lodash_1.size)(currentUser.subscribedUser);
            return returnedObject;
        });
    }
    userDetail(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                // Fetch the user by userId
                const userProfile = yield User_1.default.findById(userId);
                if (!userProfile) {
                    throw new Error("User not found");
                }
                return userProfile;
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    userInviteCount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const referralCode = req.body.referralCode;
            try {
                const referringUser = yield User_1.default.findOne({ referralCode: referralCode });
                if (!referringUser) {
                    throw new Error("Referring user not found.");
                }
                if (referringUser) {
                    const updateUser = yield User_1.default.findOneAndUpdate({ referralCode }, { $inc: { inviteUserCount: 1 } });
                    return updateUser;
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    refreshToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken, userId, os, ipAddress, browserName, browserVersion, isMobile, mobileId, mobileName, } = req.body;
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("invalid or unauthorised user");
            const existingRefreshToken = yield RefreshToken_1.default.findOne({
                token: refreshToken,
                user: userId,
            });
            if (!existingRefreshToken)
                throw new Error("Invalid refresh token");
            const newRefreshToken = yield (0, generateToken_1.generateRefreshToken)();
            // save logged in device information
            const devicePayload = {
                userId: userId,
                os,
                ipAddress,
                browserName,
                browserVersion,
                isMobile,
                mobileId,
                mobileName,
            };
            const savedDevice = yield DevicesServices_1.default.saveDeviceIntoDB(devicePayload, true);
            const token = jsonwebtoken_1.default.sign({
                userId: existingRefreshToken.user,
                deviceId: savedDevice._id,
                role: user.role || user_1.USER_ROLES.USER,
            }, config_1.default.jwtSecretKey, {
                expiresIn: config_1.default.jwtTokenExpiration,
            });
            existingRefreshToken.token = newRefreshToken;
            yield existingRefreshToken.save();
            return { token, refreshToken: newRefreshToken };
        });
    }
}
exports.default = new AuthService();
//# sourceMappingURL=AuthService.js.map