"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRefreshToken = () => {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(64, (err, buffer) => {
            if (err) {
                reject(err);
            }
            else {
                const refreshToken = buffer.toString('hex');
                resolve(refreshToken);
            }
        });
    });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=generateToken.js.map