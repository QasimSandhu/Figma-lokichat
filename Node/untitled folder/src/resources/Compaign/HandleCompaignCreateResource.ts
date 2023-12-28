import ApiResponse from "../../lib/response/ApiResponse";

interface CompaignCreateResourceProps {
  _id: any;
  title: string;
  description: string;
  creator:any
}

class CompaignCreateResource extends ApiResponse {
  constructor(
    data: CompaignCreateResourceProps | CompaignCreateResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "Comapaign created successfully"));
    }
  }
}

function formatData(data: CompaignCreateResourceProps): any {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    creator:data.creator
  };
}

export default CompaignCreateResource;
