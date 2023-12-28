import ApiResponse from "../../lib/response/ApiResponse";

interface CompaignResourceProps {
  _id: any;
  title: string;
  description: string;
  creator:any
}

class CompaignResource extends ApiResponse {
  constructor(
    data: CompaignResourceProps | CompaignResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = data
      super(ApiResponse.success(formattedData, "Comapaign fetched successfully"));
    }
  }
}

function formatData(data: CompaignResourceProps): any {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    creator:data.creator
  };
}

export default CompaignResource;
