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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(email = '2016cs507@student.uet.edu.pk', otp) {
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
                subject: 'OTP Verification',
                text: `Your OTP is: ${otp}`, // Plain text body
            };
            // Send the email
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send OTP email');
        }
    });
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendMail.js.map