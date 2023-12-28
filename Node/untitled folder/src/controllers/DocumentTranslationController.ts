import AudioService from "../services/AudioService";
import DocumentTranslationService from "../services/DocumentTranslationService";
import { HandleAudioRequest, ShowAudioRequest, UpdateAudioRequest } from "../requests/audio/HandleAudioRequest";
import HandleAudioResource from "../resources/Audio/HandleAudioResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import HandleTranslationResource from "../resources/Translation/HandleTranslationResource";

class DocumentTranslationController {

  async store(req, res) {
    return handleRequest( req, res, null, DocumentTranslationService.store, HandleTranslationResource );
  }

  async show(req, res) {
    return handleRequest( req, res, ShowAudioRequest, AudioService.show, HandleAudioResource );
  }

  async update(req, res) {
    return handleRequest( req, res, UpdateAudioRequest, AudioService.update, HandleAudioResource );
  }

  async destroy(req, res) {
    return handleRequest( req, res, null, AudioService.destroy, HandleAudioResource );
  }

}

export default new DocumentTranslationController();
