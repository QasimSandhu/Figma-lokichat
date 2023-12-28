import ApiResponse from "../../lib/response/ApiResponse";

interface GetChatResourceProps {
  _id: any;
  messages: any[];
  chatList: any;
  feedback?: any;
  createdAt: any;
}

class GetChatResource extends ApiResponse {
  constructor(
    data: GetChatResourceProps | GetChatResourceProps[],
    error = "Sometihng went wrong while generating chat"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "Chat fetched successfully"));
    }
  }
}

function formatData(data: GetChatResourceProps): any {
  return {
    id: data._id,
    messages: data.messages,
    chatListId: data.chatList,
    feedback: data.feedback,
    createdAt: data.createdAt,
  };
}

export default GetChatResource;
