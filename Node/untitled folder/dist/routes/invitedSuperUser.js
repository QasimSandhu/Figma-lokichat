"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InvitedSuperUserController_1 = __importDefault(require("../controllers/InvitedSuperUserController"));
const router = express_1.default.Router();
router.post('/invite-superUsers', (req, res) => InvitedSuperUserController_1.default.inviteSuperUser(req, res));
exports.default = router;
//# sourceMappingURL=invitedSuperUser.js.map