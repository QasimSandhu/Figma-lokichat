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
exports.sendMailtoUser = exports.sendGridEmail = void 0;
const index_1 = require("../templates/index");
const mailTypes_1 = require("../constants/mailTypes");
const node_mailjet_1 = __importDefault(require("node-mailjet"));
function sendGridEmail(to, html, subject = "Loki Chat Mailer") {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mailjetClient = node_mailjet_1.default.apiConnect("d76d7ac87278c2837e755fb617222033", "3a72618af20820b43b8b07c7b8d85746");
            console.log(to, " email");
            const request = mailjetClient.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: {
                            Email: "noreply@lokichat.com",
                            Name: "Loki Chat",
                        },
                        To: [
                            {
                                Email: to,
                                Name: "USER",
                            },
                        ],
                        Subject: subject,
                        HTMLPart: html,
                    },
                ],
            });
            const response = yield request;
            console.log("mail jet response sent");
        }
        catch (error) {
            console.error("errResponse", error.response);
            if (error === null || error === void 0 ? void 0 : error.response) {
                console.error((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.body);
            }
        }
    });
}
exports.sendGridEmail = sendGridEmail;
function sendMailtoUser(type, data = {}, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            switch (type) {
                case mailTypes_1.MAIL_TYPES.AUDIO_SHARED_MAIL:
                    yield sendGridEmail(to, (0, index_1.audioSharingTemplate)());
                    break;
                case mailTypes_1.MAIL_TYPES.DEBATE_REQUEST_APPROVED_MAIL:
                    yield sendGridEmail(to, (0, index_1.debateApprovedTemplate)(data === null || data === void 0 ? void 0 : data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.DEBATE_REQUEST_MAIL:
                    yield sendGridEmail(to, (0, index_1.debateRequestTemplate)(data === null || data === void 0 ? void 0 : data.name, data === null || data === void 0 ? void 0 : data.topic, data === null || data === void 0 ? void 0 : data.time, data.date, data === null || data === void 0 ? void 0 : data.avatart));
                    break;
                case mailTypes_1.MAIL_TYPES.FAILED_PAYMENT_MAIL:
                    yield sendGridEmail(to, (0, index_1.FailedPaymentTemplates)(data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.FORGOT_PASSWORD_MAIL:
                    yield sendGridEmail(to, (0, index_1.forgotPasswordTemplate)(data === null || data === void 0 ? void 0 : data.name, data.otp));
                    break;
                case mailTypes_1.MAIL_TYPES.GOAL_MAIL:
                    yield sendGridEmail(to, (0, index_1.goalTemplate)(data === null || data === void 0 ? void 0 : data.time));
                    break;
                case mailTypes_1.MAIL_TYPES.LIMIT_REACHED_MAIL:
                    yield sendGridEmail(to, (0, index_1.limitReachedTemplate)(data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.OTP_MAIL:
                    yield sendGridEmail(to, (0, index_1.otpTemplate)(data === null || data === void 0 ? void 0 : data.name, data === null || data === void 0 ? void 0 : data.email, data === null || data === void 0 ? void 0 : data.otp));
                    break;
                case mailTypes_1.MAIL_TYPES.REFFER_FRIEND_MAIL:
                    yield sendGridEmail(to, (0, index_1.RefferFriendTemplate)(data === null || data === void 0 ? void 0 : data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.SUPER_USER_APPROVED_MAIL:
                    yield sendGridEmail(to, (0, index_1.SuperUserApprovedTemplate)(data === null || data === void 0 ? void 0 : data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.SUPER_USER_REQUEST_MAIL:
                    yield sendGridEmail(to, (0, index_1.SuperUserRequestTemplate)(data === null || data === void 0 ? void 0 : data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.SUBSCRIPTION_EXPIRED_MAIL:
                    yield sendGridEmail(to, (0, index_1.SupscriptionExpiredTemplate)(data === null || data === void 0 ? void 0 : data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.WELCOME_MAIL:
                    yield sendGridEmail(to, (0, index_1.welcomeTemplate)(data === null || data === void 0 ? void 0 : data.name));
                    break;
                case mailTypes_1.MAIL_TYPES.INVITE_SUPER_USER_MAIL:
                    yield sendGridEmail(to, (0, index_1.IntivtedSuperUserTemplate)(data === null || data === void 0 ? void 0 : data.name, data.invitationCode));
                    break;
                default:
                    console.log("Invalid Mail Type");
                    break;
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.sendMailtoUser = sendMailtoUser;
//# sourceMappingURL=sendGridEmail.js.map