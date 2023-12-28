import { handleRequest } from "../lib/helpers/requestHelper";
import NotificationsResource from "../resources/Notifications/NotificationsResource";
import UserNotificationsList from "../resources/Notifications/UserNotificationsListResource";
import NotificationsService from "../services/NotificationsService";
import StripeService from "../services/StripeService";
import { GetNotifications, StoreNotification, UpdateNotificationsList } from "../requests/notifications/NotificationsRequest";

class NotificationsController {
  async getSetupAccountLink(req, res) {
    return handleRequest( req, res, null, StripeService.getStripeSetupUrl, null);
  }

  async getPendingTransactions(req, res) {
    return handleRequest( req, res, null, StripeService.getUserPendingTransactions, null);
  }

  async getTransactionHistory(req, res) {
    return handleRequest( req, res, null, StripeService.getUserTransactionsHistory, null);
  }

  async transferToConnectAccount(req, res) {
    return handleRequest( req, res, null, StripeService.sendMoneyToConnectedAccount, null);
  }

  async getStripeConnectAccountLoginLink(req, res) {
    return handleRequest( req, res, null, StripeService.getStripeLoginLink, null);
  }

  async getStripeConnectAccountDetails(req, res) {
    return handleRequest( req, res, null, StripeService.getConnectAccountDetails, null);
  }

  // async store(req, res) {
  //   return handleRequest( req, res, StoreNotification, NotificationsService.store, NotificationsResource);
  // }

  // async update(req, res) {
  //   return handleRequest( req, res, UpdateNotificationsList, NotificationsService.update, UserNotificationsList);
  // }

  // async destroy(req, res) {
  //   return handleRequest(req, res, GetNotifications, NotificationsService.destroy, NotificationsResource);
  // }
}
  
export default new NotificationsController();