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
const requestHelper_1 = require("../lib/helpers/requestHelper");
const InvitedSuperUserService_1 = __importDefault(require("../services/InvitedSuperUserService"));
const HandleInviteUserResource_1 = __importDefault(require("../resources/InviteSuperUser/HandleInviteUserResource"));
class InvitedSuperUserController {
    inviteSuperUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, InvitedSuperUserService_1.default.inviteSuperUser, HandleInviteUserResource_1.default);
        });
    }
}
exports.default = new InvitedSuperUserController();
//# sourceMappingURL=InvitedSuperUserController.js.map