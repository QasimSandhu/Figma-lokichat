import {
  AddChatFeedback,
  DeleteMessage,
  GetChatListsRequest,
  HandleChatRequest,
  HandleGetChatRequest,
  UpdateChatListRequest,
  UpdateChatMessageRequest,
  UpdateMessage,
} from "../requests/chat/HandleChatRequest";
import HandleChatResource from "../resources/Chat/HandleChatResource";
import ChatService from "../services/ChatService";
import { handleRequest } from "../lib/helpers/requestHelper";
import GetChatResource from "../resources/Chat/GetChatResource";
import GetChatListsResource from "../resources/Chat/GetChatListsResource";
import ShowChatResource from "../resources/Chat/ShowChatResource";
import PromptResource from "../resources/Chat/GetPromptResource";
import ChatListResource from "../resources/Chat/ChatListResources";
import UpdateChatListsResource from "../resources/Chat/UpdateChatListResource";

class ChatController {
  async store(req, res) {
    return handleRequest(req, res, HandleChatRequest, ChatService.store, HandleChatResource);
  }

  async storeChatList(req, res) {
    return handleRequest(req, res, GetChatListsRequest, ChatService.storeChatList, GetChatResource);
  }

  async reStore(req, res) {
    return handleRequest(req, res, UpdateChatMessageRequest, ChatService.reStore, HandleChatResource);
  }

  async show(req, res) {
    return handleRequest(req, res, HandleGetChatRequest, ChatService.show, GetChatResource);
  }
  async showDetails(req, res) {
    return handleRequest(req, res, HandleGetChatRequest, ChatService.showDetails, ShowChatResource);
  }

  async update(req, res) {
    return handleRequest(req, res, UpdateChatMessageRequest, ChatService.update, HandleChatResource);
  }

  async index(req, res) {
    return handleRequest(req, res, GetChatListsRequest, ChatService.index, GetChatListsResource);
  }
  async indexByPagination(req, res) {
    return handleRequest(req, res, GetChatListsRequest, ChatService.indexByPagination, ChatListResource);
  }
  
  async updateChatList(req, res) {
    return handleRequest(req, res, UpdateChatListRequest, ChatService.updateChatList, UpdateChatListsResource);
  }

  async feedback(req, res) {
    return handleRequest(req, res, AddChatFeedback, ChatService.feedback, GetChatResource);
  }

  async promptAdvisor(req, res) {
    return handleRequest(req, res, null, ChatService.promptAdvisor, PromptResource);
  }

  async storeGoal(req, res) {
    return handleRequest(req, res, null, ChatService.storeGoal, HandleChatResource);
  }

  async deleteMessage(req, res) {
    return handleRequest(req, res, DeleteMessage, ChatService.deleteMessage, HandleChatResource);
  }

  async updateMessage(req, res) {
    return handleRequest(req, res, UpdateMessage, ChatService.updateMessage, HandleChatResource);
  }
}

export default new ChatController();
