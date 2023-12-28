
import stripeWebhookService from "../services/stripeWebhookService";
import { handleRequest } from "../lib/helpers/requestHelper";


class SubscriptionController {

  async stripeWebhook(req, res) {
    
    return handleRequest( req, res, null, stripeWebhookService.stripeWebhook, null );
  }
  

}

export default new SubscriptionController();