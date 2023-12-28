import mongoose from "mongoose";
import ApiResponse from "../../lib/response/ApiResponse";

interface VoiceListsResourceProps {
  _id: string | mongoose.Types.ObjectId;
  languageCodes: string;
  ssmlGender: string;
  name: string;
  createdAt: string;
  naturalSampleRateHertz:Number;
  characterName:string
}


class VoiceListsResource extends ApiResponse {
  constructor(data: VoiceListsResourceProps | VoiceListsResourceProps[], error = "Sometihing went wrong.") {
    
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
      super(ApiResponse.success(formattedData, "voicelists fetched successfully", 200));
    }
  }
}

function formatData(data: VoiceListsResourceProps): any {
  
  return {
    id: data._id,
    ssmlGender: data.ssmlGender,
    language: data.languageCodes,
    name: data.name,
    naturalSampleRateHertz:data.naturalSampleRateHertz,
    characterName:data.characterName
};
}

export default VoiceListsResource;
