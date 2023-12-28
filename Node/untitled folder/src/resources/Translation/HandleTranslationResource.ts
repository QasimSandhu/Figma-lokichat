import ApiResponse from "../../lib/response/ApiResponse";

interface HandleTranslationResourceProps {
  _id?: any;
  text?: string;
  chat?: any;
  speed?: any;
  language?: any;
  audioFilePath?: string;
  voiceIdentifier?: string;
  createdAt?: any;
}

class HandleTranslationResource extends ApiResponse {
  constructor(
    data: HandleTranslationResourceProps | HandleTranslationResourceProps[],
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

function formatData(data: HandleTranslationResourceProps): any {
  return data
}

export default HandleTranslationResource;
