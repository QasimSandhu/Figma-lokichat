import { handleRequest } from "../lib/helpers/requestHelper";
import NotificationsResource from "../resources/Notifications/NotificationsResource";
import UserNotificationsList from "../resources/Notifications/UserNotificationsListResource";
import NotificationsService from "../services/NotificationsService";
import { GetNotifications, StoreNotification, UpdateNotificationsList } from "../requests/notifications/NotificationsRequest";

class NotificationsController {
  async index(req, res) {
    return handleRequest( req, res, GetNotifications, NotificationsService.index, null);
  }

  async store(req, res) {
    return handleRequest( req, res, StoreNotification, NotificationsService.store, NotificationsResource);
  }

  async update(req, res) {
    return handleRequest( req, res, UpdateNotificationsList, NotificationsService.update, UserNotificationsList);
  }

  async destroy(req, res) {
    return handleRequest(req, res, GetNotifications, NotificationsService.destroy, NotificationsResource);
  }

  async read(req, res) {
    return handleRequest( req, res, null, NotificationsService.read, null);
  }

  async sendMail(req, res) {
    return handleRequest( req, res, null, NotificationsService.sendMail, null);
  }
}
  
export default new NotificationsController();