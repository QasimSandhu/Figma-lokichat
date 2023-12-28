"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
function generateOTP() {
    const otpLength = 4;
    const digits = '123456789';
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
}
exports.generateOTP = generateOTP;
//# sourceMappingURL=generateOtp.js.map