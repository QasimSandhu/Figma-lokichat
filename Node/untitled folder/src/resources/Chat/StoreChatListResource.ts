import ApiResponse from "../../lib/response/ApiResponse";

interface StoreChatListResourceProps {
  _id: string;
  title: string;
  color: string;
  createdAt: string;
  chatsCount?: number;
  chats?: any[];
}

class StoreChatListResource extends ApiResponse {
  constructor(
    data: StoreChatListResourceProps | StoreChatListResourceProps[],
    error = "Sometihng went wrong while generating chat list"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "response generated successfully"));
    }
  }
}

function formatData(data: StoreChatListResourceProps): any {
  return {
    id: data._id,
    title: data.title,
    color: data.color,
    chats: data.chats,
    createdAt: data.createdAt,
    chatsCount: data.chatsCount || 0
  };
}

export default StoreChatListResource;
