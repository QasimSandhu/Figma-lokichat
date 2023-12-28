import ImageLibraryService from "../services/ImageLibraryService";
import ImageLibraryResources from "../resources/PhotoGeneration/ImageLibraryResources";
import ImageLibraryResource from "../resources/PhotoGeneration/ImageLibraryResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import { DestroyImageLibrary, GetImageLibrary, UpdateImageLibrary } from "../requests/photoGeneration/ImageLibraryRequest";

class PhotoGenerationController {

  async index(req, res) {
    return handleRequest( req, res, GetImageLibrary, ImageLibraryService.index, ImageLibraryResources );
  }
  
  async update(req, res) {
    return handleRequest( req, res, UpdateImageLibrary, ImageLibraryService.update, ImageLibraryResource );
  }

  async destroy(req, res) {
    return handleRequest( req, res, DestroyImageLibrary, ImageLibraryService.destroy, ImageLibraryResource );
  }
}

export default new PhotoGenerationController();
