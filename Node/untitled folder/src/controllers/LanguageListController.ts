import VoiceListsService from "../services/VoiceListsService";
import { handleRequest } from "../lib/helpers/requestHelper";
import ListsResource from "../resources/VoiceLists/LanguageListsResource";
import LanguageListService from "../services/LanguageListService";

class LanguageListController {
  // async store(req, res) {
  //   return handleRequest( req, res, null, VoiceListsService.store, null );
  // }

  async index(req, res) {
    return handleRequest( req, res, null, LanguageListService.index, ListsResource );
  }
}

export default new LanguageListController();
