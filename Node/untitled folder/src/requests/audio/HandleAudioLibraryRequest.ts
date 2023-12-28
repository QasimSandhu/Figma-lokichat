import ApiResponse from "../../lib/response/ApiResponse";

interface HandleAudioResourceProps {
  message: any;
  response: any;
  messageId: any;
  createdAt: any;
}

class HandleAudioResource extends ApiResponse {
  constructor(
    data: HandleAudioResourceProps | HandleAudioResourceProps[],
    error = "Sometihng went wrong while generating Audio"
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

function formatData(data: HandleAudioResourceProps): any {
  return {
    
    message: data.message,
    response:data.response,
    messageId: data.messageId,
    createdAt: data.createdAt,
  };
}

export default HandleAudioResource;
