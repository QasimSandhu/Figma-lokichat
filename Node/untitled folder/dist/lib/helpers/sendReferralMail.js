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
exports.sendReferralEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendReferralEmail(email = '2016cs507@student.uet.edu.pk') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a Nodemailer transporter
            const transporter = nodemailer_1.default.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'usamaitians.gcuf@gmail.com',
                    pass: 'yifzznlhlkpwuaal',
                },
            });
            // Setup email data with unicode symbols
            const mailOptions = {
                from: 'usamaitians.gcuf@gmail.com',
                to: email,
                subject: 'Free subbscription',
                text: "Congrats you have completed 5 referral.Enjoy one month free subscription", // Plain text body
            };
            // Send the email
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send subbscription email');
        }
    });
}
exports.sendReferralEmail = sendReferralEmail;
//# sourceMappingURL=sendReferralMail.js.map