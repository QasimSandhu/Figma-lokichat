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
const mailTypes_1 = require("../lib/constants/mailTypes");
const User_1 = __importDefault(require("../models/User"));
const sendGridEmail_1 = require("../lib/helpers/sendGridEmail");
const invitedSuperUser_1 = __importDefault(require("../models/invitedSuperUser"));
class InvitedSuperUserService {
    inviteSuperUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invitationCode = generateRandomString();
                const { name, email } = req.body;
                const link = process.env.FRONTEND_REDIRECT_URI;
                const existingUser = yield User_1.default.findOne({ email: email === null || email === void 0 ? void 0 : email.toLowerCase() });
                if (existingUser) {
                    console.log("error");
                    throw new Error('User already exists');
                }
                const existingUserInInviteUsers = yield invitedSuperUser_1.default.findOne({ email: email === null || email === void 0 ? void 0 : email.toLowerCase() });
                if (existingUserInInviteUsers) {
                    console.log("error");
                    throw new Error('User already invited');
                }
                const invitedSuperUser = new invitedSuperUser_1.default({ name, email, invitationCode });
                console.log("invitedSuperUser", invitedSuperUser);
                yield invitedSuperUser.save();
                yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.INVITE_SUPER_USER_MAIL, { name: name, email: email, invitationCode: invitationCode }, email);
                // await sendEmailToInviteSuperUser(email,name,invitationCode,link);
                return "User invited successfully";
            }
            catch (err) {
                console.log(err, "error");
                throw err;
            }
        });
    }
}
exports.default = new InvitedSuperUserService();
// Function to generate a random code (placeholder, use a better method)
const generateRandomString = (length = 9) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralCode += characters.charAt(randomIndex);
    }
    return referralCode;
};
//# sourceMappingURL=InvitedSuperUserService.js.map