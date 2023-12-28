import HandleBuyMoreResource from "../resources/BuyMore/HandleBuyMoreResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import { ShowPlanRequest } from "../requests/subscription/SubscriptionRequest";
import BuyMorePackageServcie from "../services/BuyMorePackageServcie";

class BuyMorePackageController {

  async store(req, res) {    
    return handleRequest( req, res, null, BuyMorePackageServcie.store, HandleBuyMoreResource );
  }

  async index(req, res) {
    return handleRequest( req, res, ShowPlanRequest, BuyMorePackageServcie.index, HandleBuyMoreResource );
  }
  async indexById(req, res) {
    return handleRequest( req, res, ShowPlanRequest, BuyMorePackageServcie.indexById, HandleBuyMoreResource );
  }
  


}

export default new BuyMorePackageController();