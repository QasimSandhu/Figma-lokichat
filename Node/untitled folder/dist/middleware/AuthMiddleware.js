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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Devices_1 = __importDefault(require("../models/Devices"));
const config_1 = __importDefault(require("../config/config"));
class AuthMiddleware {
    static isLoggedIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const excludedPaths = ["/login", "/register"];
            if (excludedPaths.includes(req.path)) {
                return next();
            }
            // Get the token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
                return res.status(401).json({
                    status: 401,
                    success: false,
                    message: "Unauthorized",
                });
            }
            const token = authHeader.split(" ")[1];
            // Verify the token
            jsonwebtoken_1.default.verify(token, config_1.default.jwtSecretKey, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(405).json({
                        status: 405,
                        success: false,
                        message: "Unauthorized",
                    });
                }
                const device = yield Devices_1.default.findOne({
                    _id: decoded.deviceId,
                    user: decoded.userId,
                });
                if (!device) {
                    return res.status(403).json({
                        success: false,
                        status: 403,
                        message: "Unauthorized",
                    });
                }
                req.deviceId = decoded.deviceId;
                req.userId = decoded.userId;
                next();
            }));
        });
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map