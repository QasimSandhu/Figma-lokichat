import { size } from "lodash";
import ApiResponse from "../../lib/response/ApiResponse";

interface ShowChatResourceProps {
  _id: string;
  messages: any[];
  chatList: any;
  createdAt: any;
}

class ShowChatResource extends ApiResponse {
  constructor(
    data: ShowChatResourceProps,
    error = "Sometihng went wrong while fetching chat"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = formatData(data);
      super(ApiResponse.success(formattedData, "chat fetched successfully"));
    }
  }
}

function formatData(data: ShowChatResourceProps): any {
  const returnedArray = [];
  for (let i = 0; i < size(data.messages) - 1; i += 2) {
    returnedArray.push({
      id: data._id,
      chatList: data.chatList,
      message: data.messages[i].content,
      response: data.messages[i + 1].content,
      messageId: data.messages[i].messageId,
      createdAt: data.messages[i].timestamp,
    });
  }

  return returnedArray;
}

export default ShowChatResource;
