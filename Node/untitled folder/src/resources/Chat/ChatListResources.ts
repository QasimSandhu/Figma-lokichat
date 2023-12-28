import ApiResponse from "../../lib/response/ApiResponse";

interface ChatListResourceProps {
    chats: any;
    currentPage: string;
    pages: string;
    totalChats: string;
    perPage?: any;
    isAvailableChat?:any;
}

class ChatListResource extends ApiResponse {
  constructor(
    data: ChatListResourceProps | ChatListResourceProps[],
    error = "Sometihng went wrong while generating chat list"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "chat list fetched successfully"));
    }
  }
}

function formatChatData(data: any): any {
  return {
    id: data._id,
    chatList: data.chatList,
    messages: data.messages,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function formatData(data: ChatListResourceProps): any {
  const formattedChat = data.chats?.map(formatChatData);
    return {
    chats: formattedChat,
    currentPage: data.currentPage,
    pages: data.pages,
    totalChats: data.totalChats,
    perPage: data.perPage,
    isAvailableChat:data.isAvailableChat
  };
}

export default ChatListResource;
