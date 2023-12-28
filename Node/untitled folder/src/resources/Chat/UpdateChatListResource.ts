import ApiResponse from "../../lib/response/ApiResponse";

interface ChatResourceProps {
  _id: any;
  chatList: string;
  feedback: any;
  createdAt: string;
}

class UpdateChatListsResource extends ApiResponse {
  constructor(
    data: ChatResourceProps,
    error = "Sometihng went wrong while generating chat"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)? data.map(formatData) : formatData(data);

      super(ApiResponse.success(formattedData, "Chat list updated successfully"));
    }
  }
}

function formatData(data: ChatResourceProps): any {
  return {
    id: data._id,
    chatList: data.chatList,
    feedback: data.feedback,
    createdAt: data.createdAt,
  };
}

export default UpdateChatListsResource;
