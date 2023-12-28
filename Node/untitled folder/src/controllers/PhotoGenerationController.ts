import PhotoGenerationService from "../services/PhotoGenerationService";
import PhotoGenerationResource from "../resources/PhotoGeneration/PhotoGenerationResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import { PhotoGenerationRequest, UpdateGeneratedPhoto, QueuedPhotoRequest } from "../requests/photoGeneration/PhotoGenerationRequest";

class PhotoGenerationController {

  async store(req, res) {
    return handleRequest( req, res, PhotoGenerationRequest, PhotoGenerationService.store, PhotoGenerationResource );
  }

  async update(req, res) {
    return handleRequest( req, res, UpdateGeneratedPhoto, PhotoGenerationService.update, PhotoGenerationResource );
  }

  async fetchQueuedPhoto(req, res) {
    return handleRequest( req, res, QueuedPhotoRequest, PhotoGenerationService.fetchQueuedPhoto, PhotoGenerationResource );
  }
}

export default new PhotoGenerationController();
