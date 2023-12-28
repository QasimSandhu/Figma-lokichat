import ApiResponse from "../../lib/response/ApiResponse";

interface LiveNotebookResourceProps {
  _id: any;
  message: string;
  response: string;
  messageId: string;
  createdAt: string;
}

class HandleChatResource extends ApiResponse {
  constructor(
    data: LiveNotebookResourceProps | LiveNotebookResourceProps[],
    error = "Sometihng went wrong while adding livenotebook"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "live notebook added successfully"));
    }
  }
}

function formatData(data: LiveNotebookResourceProps): any {
  return {
    id: data._id,
    message: data.message,
    response: data.response,
    messageId: data.messageId,
    createdAt: data.createdAt
  };
}

export default HandleChatResource;
