import HandleAudioResource from "../resources/Audio/HandleAudioLibraryResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import AudioLibraryService from "../services/AudioLibraryService";
import LoginResource from "../resources/Auth/LoginResource";
  
  class ChatController {
    
    async index(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.index, HandleAudioResource );
    }
    

    async indexPreviousMonth(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.indexPreviousMonth, HandleAudioResource );
    }
    async sharedAudioLibrary(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.sharedAudioLibrary, HandleAudioResource );
    }
    async sharedAudioLibraryPrevMonth(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.sharedAudioLibraryPrevMonth, HandleAudioResource );
    }
    
    
    async update(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.update, HandleAudioResource );
    }
    async addSharedAudio(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.addSharedAudio, HandleAudioResource );
    }
    
    async removeSharedAudio(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.removeSharedAudio, HandleAudioResource );
    }

    async destroy(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.destroy, HandleAudioResource );
    }
    async getAllUsers(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.getAllUsers, HandleAudioResource );
    }
    async getUser(req, res) {
      return handleRequest( req, res, null, AudioLibraryService.getUser, LoginResource );
    }
  }
  
  export default new ChatController();
  