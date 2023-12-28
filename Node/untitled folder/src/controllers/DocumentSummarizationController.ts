import AudioService from "../services/AudioService";
import DocumentTranslationService from "../services/DocumentTranslationService";
import { HandleAudioRequest, ShowAudioRequest, UpdateAudioRequest } from "../requests/audio/HandleAudioRequest";
import HandleAudioResource from "../resources/Audio/HandleAudioResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import HandleTranslationResource from "../resources/Translation/HandleTranslationResource";
import DocumentSummarizationService from "../services/DocumentSummarizationService";

class DocumentSummerizationController {

  async generate(req, res) {
    return handleRequest( req, res, null, DocumentSummarizationService.generate, HandleTranslationResource );
  }

  async examMe(req, res) {
    return handleRequest( req, res, null, DocumentSummarizationService.examMe, HandleTranslationResource );
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

export default new DocumentSummerizationController();
