import { size } from "lodash";
import ApiResponse from "../../lib/response/ApiResponse";

interface messages {
  _id: string;
  sender: string;
  content: string;
  messageId: string;
}

interface GetChatListResourceProps {
  today: any;
  lastWeek: any;
  last30Days: any;
  older: any;
}

class GetChatListsResource extends ApiResponse {
  constructor(
    data: GetChatListResourceProps[] | any[],
    error = "Sometihng went wrong while generating chat"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = {};

      for (const key in data) {
        const value = formatDataKeys(data[key]);
        formattedData[key] = value;
      }
      super(
        ApiResponse.success(formattedData, "Chat list fetched successfully")
      );
    }
  }
}

function formatDataKeys(data: any): any {
  if (size(data) > 0) {
    const formattedChat = Array.isArray(data)
      ? data.map(formatData)
      : formatData(data);
    return formattedChat;
  } else return [];
}

function formatData(data: any) {
  const formattedMessages = Array.isArray(data.messages)
    ? data.messages.map(formatMessages)
    : formatMessages(data.messages);
  return {
    id: data._id,
    messages: formattedMessages,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

function formatMessages(message: messages): any {
  return {
    id: message._id,
    messageId: message.messageId,
    sender: message.sender,
    content: message.content,
  };
}

export default GetChatListsResource;
