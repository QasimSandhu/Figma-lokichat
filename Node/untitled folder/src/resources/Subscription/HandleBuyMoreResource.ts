import mongoose from "mongoose";
import ApiResponse from "../../lib/response/ApiResponse";

interface HandleBBuyMoreResourceProps {
  _id: string | mongoose.Types.ObjectId;
  clientSecret?:any
}

class HandleBuyMoreResource extends ApiResponse {
  constructor(
    data: HandleBBuyMoreResourceProps | HandleBBuyMoreResourceProps[],
    error = "Sometihing went wrong."
  ) {
    
    
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
        
      super(ApiResponse.success(formattedData, " purchased successfully"));
    }
  }
}

function formatData(data: HandleBBuyMoreResourceProps): any {
  
  return {
    clientSecret:data.clientSecret
  };
}

export default HandleBuyMoreResource;
