import {
  StoreChatList,
  ExportChatLists,
  GetChatListsRequest,
} from "../requests/chat/HandleChatRequest";
import ChatListService from "../services/ChatListService";
import { handleRequest } from "../lib/helpers/requestHelper";
import StoreChatListResource from "../resources/Chat/StoreChatListResource";
import ShowChatListResource from "../resources/Chat/ShowChatListResource";
import ChatListResources from "../resources/Chat/ChatListResources";
import GetChatResource from "../resources/Chat/GetChatResource";

  class ChatController {
  
    async show(req, res) {
      return handleRequest(req, res, GetChatListsRequest, ChatListService.show, ShowChatListResource);
    }
    async showByPagination(req, res) {
      return handleRequest(req, res, GetChatListsRequest, ChatListService.showByPagination, ChatListResources);
    }
    async index(req, res) {
      return handleRequest(req, res, GetChatListsRequest, ChatListService.index, StoreChatListResource);
    }
  
    async store(req, res) {
      return handleRequest(req, res, StoreChatList, ChatListService.store, StoreChatListResource);
    }

    async export(req, res) {
      return handleRequest(req, res, ExportChatLists, ChatListService.export, GetChatResource);
    }
  }
  
  export default new ChatController();
  