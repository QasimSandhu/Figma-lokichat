"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    "client_id": config_1.default.appleAuth.clientID,
    "team_id": config_1.default.appleAuth.teamID,
    "key_id": config_1.default.appleAuth.keyID,
    "scope": "name email"
};
//# sourceMappingURL=apple.config.js.map