import { AddToNotebookRequest, DeleteUserNotebooks, UpdateNotebookRequest } from "../requests/chat/HandleChatRequest";
import LiveNotebookResource from "../resources/Notebook/LiveNotebookResource";
import NotebookService from "../services/NotebookService";
import { handleRequest } from "../lib/helpers/requestHelper";
import HandleGenerateTextResource from "../resources/Notebook/GenerateTextResource";

class NotebookController {
  async store(req, res) {
    return handleRequest(req, res, AddToNotebookRequest, NotebookService.store, LiveNotebookResource );
  }

  async index(req, res) {
    return handleRequest(req, res, null, NotebookService.index, LiveNotebookResource);
  }

  async destroy(req, res) {
    return handleRequest(req, res, null, NotebookService.destroy, LiveNotebookResource);
  }

  async destroyByUserId(req, res) {
    return handleRequest(req, res, DeleteUserNotebooks, NotebookService.destroyByUserId, LiveNotebookResource);
  }

  async update(req, res) {
    return handleRequest(req, res, UpdateNotebookRequest, NotebookService.update, LiveNotebookResource);
  }
  async generateTextFromPdf(req, res) {
    return handleRequest( req, res, null, NotebookService.generateTextFromPdf, HandleGenerateTextResource );
  }
}

export default new NotebookController();
