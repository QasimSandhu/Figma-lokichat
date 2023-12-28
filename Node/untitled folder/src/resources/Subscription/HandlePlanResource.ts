import mongoose from "mongoose";
import ApiResponse from "../../lib/response/ApiResponse";

interface HandlePlanResourceProps {
  _id: string | mongoose.Types.ObjectId;
    userName: string;
    email: string;
    token: string;
    bio?: string ;
    subscription?:string
}

class HandlePlanResource extends ApiResponse {
  constructor(
    data: HandlePlanResourceProps | HandlePlanResourceProps[],
    error = "Sometihing went wrong."
  ) {
    
    
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
        
      super(ApiResponse.success(formattedData, "plan purchased successfully"));
    }
  }
}

function formatData(data: HandlePlanResourceProps): any {
  
  return {
    subscription:data.subscription
  };
}

export default HandlePlanResource;
