import { handleRequest } from "../lib/helpers/requestHelper";
import CompainServcie from "../services/CompainService";
import CompaignResource from "../resources/Compaign/HandleCompaignResource";
import CompaignCreateResource from "../resources/Compaign/HandleCompaignCreateResource";

class CompainController {

  async store(req, res) {    
    return handleRequest( req, res, null, CompainServcie.store, CompaignCreateResource );
  }

  async index(req, res) {
    return handleRequest( req, res, null, CompainServcie.index, CompaignResource );
  }
  async count(req, res) {
    return handleRequest( req, res, null, CompainServcie.count, CompaignResource );
  }
  async destroy(req, res) {    
    return handleRequest( req, res, null, CompainServcie.destroy, CompaignResource );
  }
  async indexById(req, res) {
    return handleRequest( req, res, null, CompainServcie.indexById, CompaignResource );
  }
async referralList(req, res) {
    return handleRequest( req, res, null, CompainServcie.referralList, CompaignResource );
  }
  async referralChart(req, res) {
    return handleRequest( req, res, null, CompainServcie.referralChart, CompaignResource );
  }
  async referralGraph(req, res) {
    return handleRequest( req, res, null, CompainServcie.referralGraph, CompaignResource );
  }
  async newReferralList(req, res) {
    return handleRequest( req, res, null, CompainServcie.newReferralList, CompaignResource );
  }
  //////////////////Super User Data////////////////////////////////////
  async getTotalData(req, res) {
    return handleRequest( req, res, null, CompainServcie.getTotalData, null );
  }
  async getDashboardOverview(req, res) {
    return handleRequest( req, res, null, CompainServcie.getDashboardOverview, null );
  }
  async getCampaignState(req, res) {
    return handleRequest( req, res, null, CompainServcie.getCampaignState, null );
  }

  async getIncomeData(req, res) {
    return handleRequest( req, res, null, CompainServcie.getIncomeDate, null );
  }
  

}

export default new CompainController();