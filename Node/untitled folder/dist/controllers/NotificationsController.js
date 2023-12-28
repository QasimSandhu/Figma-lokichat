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
const NotificationsResource_1 = __importDefault(require("../resources/Notifications/NotificationsResource"));
const UserNotificationsListResource_1 = __importDefault(require("../resources/Notifications/UserNotificationsListResource"));
const NotificationsService_1 = __importDefault(require("../services/NotificationsService"));
const NotificationsRequest_1 = require("../requests/notifications/NotificationsRequest");
class NotificationsController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, NotificationsRequest_1.GetNotifications, NotificationsService_1.default.index, null);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, NotificationsRequest_1.StoreNotification, NotificationsService_1.default.store, NotificationsResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, NotificationsRequest_1.UpdateNotificationsList, NotificationsService_1.default.update, UserNotificationsListResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, NotificationsRequest_1.GetNotifications, NotificationsService_1.default.destroy, NotificationsResource_1.default);
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, NotificationsService_1.default.read, null);
        });
    }
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, NotificationsService_1.default.sendMail, null);
        });
    }
}
exports.default = new NotificationsController();
//# sourceMappingURL=NotificationsController.js.map