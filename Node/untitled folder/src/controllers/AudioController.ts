import AudioService from "../services/AudioService";
import { HandleAudioRequest, ShowAudioRequest, UpdateAudioRequest } from "../requests/audio/HandleAudioRequest";
import HandleAudioResource from "../resources/Audio/HandleAudioResource";
import { handleRequest } from "../lib/helpers/requestHelper";

class AudioController {

  async store(req, res) {
    return handleRequest( req, res, HandleAudioRequest, AudioService.store, HandleAudioResource);
  }

  async show(req, res) {
    return handleRequest( req, res, ShowAudioRequest, AudioService.show, HandleAudioResource);
  }

  async update(req, res) {
    return handleRequest( req, res, UpdateAudioRequest, AudioService.update, HandleAudioResource);
  }

  async destroy(req, res) {
    return handleRequest( req, res, null, AudioService.destroy, HandleAudioResource );
  }

}

export default new AudioController();
