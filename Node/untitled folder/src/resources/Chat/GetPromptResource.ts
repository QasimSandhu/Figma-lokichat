import ApiResponse from "../../lib/response/ApiResponse";

interface PromptResourceProps {
   data:any
}

class PromptResource extends ApiResponse {
  constructor(
    data: PromptResourceProps | PromptResourceProps[],
    error = "Sometihng went wrong while getting prompt list"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
        
      const formattedData = (data);
      super(ApiResponse.success(formattedData, "response generated successfully"));
    }
  }
}

function formatData(data: PromptResourceProps): any {
  return {
    data: data,
  };
}

export default PromptResource;
