import ApiResponse from "../../lib/response/ApiResponse";

interface ShowChatListResourceProps {
  id: string;
  title: string;
  color: string;
  createdAt: string;
  chatData?: any;
}

class ShowChatListResource extends ApiResponse {
  constructor(
    data: ShowChatListResourceProps | ShowChatListResourceProps[],
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
        messages: data.messages,
        createdAt: data.createdAt,
    }
}

function formatData(data: ShowChatListResourceProps): any {
  const formattedChat = {
    today: data.chatData.today.map(formatChatData),
    lastWeek: data.chatData.lastWeek.map(formatChatData),
    last30Days: data.chatData.last30Days.map(formatChatData),
    older: data.chatData.older.map(formatChatData)
  }
    return {
    id: data.id,
    title: data.title,
    color: data.color,
    chats: formattedChat,
    createdAt: data.createdAt,
  };
}

export default ShowChatListResource;
