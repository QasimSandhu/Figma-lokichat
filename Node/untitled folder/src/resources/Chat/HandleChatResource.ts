import ApiResponse from "../../lib/response/ApiResponse";

interface HandleChatResourceProps {
  message: any;
  response: any;
  chatId: any;
  title?: string;
  color?: string;
  messageId: any;
  responseTo: any;
  createdAt: any;
}

class HandleChatResource extends ApiResponse {
  constructor(
    data: HandleChatResourceProps | HandleChatResourceProps[],
    error = "Sometihng went wrong while generating chat"
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

function formatData(data: HandleChatResourceProps): any {
  return {
    chatId: data.chatId,
    title: data.title,
    color: data.color,
    message: data.message,
    response: data.response,
    messageId: data.messageId,
    responseTo: data.responseTo,
    createdAt: data.createdAt,
  };
}

export default HandleChatResource;
