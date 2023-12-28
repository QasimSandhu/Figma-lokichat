import { handleRequest } from "../lib/helpers/requestHelper";
import { GetDebate, StoreDebate, UpdateDebate, UpdateDebateUsers, UpdateBotMessage, RemoveUserFromDebate } from "../requests/debate/DebateRequest";
import DebateService from "../services/DebateService";
import DebateResource from "../resources/Debate/DebateResource";
import UpdateDebateResource from "../resources/Debate/UpdateDebateResource";
import DebateResourcePagination from "../resources/Debate/DebateResourcePagination";
import ReadDebateMessages from "../resources/Debate/ReadDebateMessages";

class DebateController {

  async store(req, res) {
    return handleRequest(req, res, StoreDebate, DebateService.store, DebateResource);
  }

  async index(req, res) {
    return handleRequest(req, res, GetDebate, DebateService.index, DebateResourcePagination);
  }

  async show(req, res) {
    return handleRequest(req, res, GetDebate, DebateService.show, DebateResource);
  }

  async update(req, res) {
    return handleRequest(req, res, UpdateDebate, DebateService.update, UpdateDebateResource);
  }

  async updateMessage(req, res) {
    return handleRequest(req, res, UpdateDebate, DebateService.updateMessages, UpdateDebateResource);
  }

  async updateInvitedUsers(req, res) {
    return handleRequest(req, res, UpdateDebateUsers, DebateService.updateInvitedUsers, UpdateDebateResource);
  }

  async updateBotMessage(req, res) {
    return handleRequest(req, res, UpdateBotMessage, DebateService.updateBotMessages, UpdateDebateResource);
  }

  async leaveDebate(req, res) {
    return handleRequest(req, res, UpdateDebate, DebateService.leaveDebate, UpdateDebateResource);
  }

  async markAsReadDebate(req, res) {
    return handleRequest(req, res, UpdateDebate, DebateService.markAsReadDebate, ReadDebateMessages);
  }

  async removeUserFromDebate(req, res) {
    return handleRequest(req, res, RemoveUserFromDebate, DebateService.removeUserFromDebate, UpdateDebateResource);
  }
}

export default new DebateController();