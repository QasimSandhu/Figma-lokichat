import ApiResponse from "../../lib/response/ApiResponse";

interface GenrateTextResourceProps {
  text: string;
}

class HandleGenerateTextResource extends ApiResponse {
  constructor(
    data: GenrateTextResourceProps | GenrateTextResourceProps[],
    error = "Sometihng went wrong while adding livenotebook"
  ) {
    
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(data, "Text Fetched  successfully"));
    }
  }
}

function formatData(data: GenrateTextResourceProps): any {
  return {
    text: data.text,
  };
}

export default HandleGenerateTextResource;
