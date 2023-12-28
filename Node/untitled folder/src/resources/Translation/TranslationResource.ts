import ApiResponse from "../../lib/response/ApiResponse";

interface HandleAudioResponse {
  _id: any;
  text: any;
  audioFilePath: any;
  createdAt: any;
  user?:any;
  isDeleted?:any;
  updatedAt?:any;
  language?:any;
  speed?:any

}

class HandleAudioResource extends ApiResponse {
  constructor(
    data: HandleAudioResponse | HandleAudioResponse[],
    error = "Sometihng went wrong while generating audio"
  ) {
    
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = data
        
      super(ApiResponse.success(formattedData, "response generated successfully"));
    }
  }
}

function formatData(data: HandleAudioResponse): any {
  return {
    id: data._id,
    text: data.text,
    audioFilePath: data.audioFilePath,
    createdAt: data.createdAt,
    user: data.user,
    isDeleted: data.isDeleted,
    updatedAt: data.updatedAt,
    language: data.language,
    speed: data.speed,

  };
}

export default HandleAudioResource;
