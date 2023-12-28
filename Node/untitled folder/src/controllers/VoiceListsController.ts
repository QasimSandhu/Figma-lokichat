import VoiceListsService from "../services/VoiceListsService";
import { handleRequest } from "../lib/helpers/requestHelper";
import VoiceListsResource from "../resources/VoiceLists/VoiceListsResource";

class VoiceListController {
  // async store(req, res) {
  //   return handleRequest( req, res, null, VoiceListsService.store, null );
  // }

  async index(req, res) {
    return handleRequest( req, res, null, VoiceListsService.index, VoiceListsResource );
  }
}

export default new VoiceListController();
