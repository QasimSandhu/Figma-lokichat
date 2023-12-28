import ApiResponse from "../../lib/response/ApiResponse";

interface InviteUserResourceProps {
  _id: any;
  title: string;
  description: string;
  creator:any
}

class InviteUserResource extends ApiResponse {
  constructor(
    data: InviteUserResourceProps | InviteUserResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = data
      super(ApiResponse.success(formattedData, "Successfully invited"));
    }
  }
}

function formatData(data: InviteUserResourceProps): any {
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    creator:data.creator
  };
}

export default InviteUserResource;
