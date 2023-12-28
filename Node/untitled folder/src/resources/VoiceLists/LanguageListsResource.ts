import mongoose from "mongoose";
import ApiResponse from "../../lib/response/ApiResponse";

interface LanguageListsResourceProps {
  _id: string | mongoose.Types.ObjectId;
  title: string;
  code: string;
  languageName: string;
  gender: string;
}


class ListsResource extends ApiResponse {
  constructor(data: LanguageListsResourceProps | LanguageListsResourceProps[], error = "Sometihing went wrong.") {
    
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
      super(ApiResponse.success(formattedData, "voicelists fetched successfully", 200));
    }
  }
}

function formatData(data: LanguageListsResourceProps): any {
  
  return {
    id: data._id,
    title: data.title,
    code: data.code,
    languageName: data.languageName,
    gender:data.gender
};
}

export default ListsResource;
