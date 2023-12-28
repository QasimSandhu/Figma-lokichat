import SubscriptionService from "../services/SubscriptionService";
import HandleSubscriptionResource from "../resources/Subscription/HandleSubscriptionResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import { ShowPlanRequest } from "../requests/subscription/SubscriptionRequest";
import HandlePlanResource from "../resources/Subscription/HandlePlanResource";
import HandleBuyMoreResource from "../resources/Subscription/HandleBuyMoreResource";
import BillingResource from "../resources/Subscription/HandleBillingResource";
import ReferralVerifyResource from "../resources/Subscription/HandleReferralVerifyResource";

class SubscriptionController {

  async store(req, res) {    
    return handleRequest( req, res, null, SubscriptionService.store, HandleSubscriptionResource );
  }

  async index(req, res) {
    return handleRequest( req, res, ShowPlanRequest, SubscriptionService.index, HandleSubscriptionResource );
  }
  
  async planSubscription(req, res) {
    
    return handleRequest( req, res, null, SubscriptionService.planSubscription, HandlePlanResource );
  }

  async createPaymentIntent(req, res) {
    
    return handleRequest( req, res, null, SubscriptionService.createPaymentIntent, HandleBuyMoreResource );
  }
  async billingPortal(req, res) {
    return handleRequest( req, res, ShowPlanRequest, SubscriptionService.billingPortal, BillingResource );
  }
  async verifyReferralCode(req, res) {
    
    return handleRequest( req, res, null, SubscriptionService.verifyReferralCode, ReferralVerifyResource );
  }

  

}

export default new SubscriptionController();