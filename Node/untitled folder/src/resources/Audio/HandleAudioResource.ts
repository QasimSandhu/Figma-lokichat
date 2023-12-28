import ApiResponse from "../../lib/response/ApiResponse";

interface HandleAudioResourceProps {
  _id: any;
  text: string;
  chat: any;
  speed: any;
  language: any;
  audioFilePath: string;
  voiceIdentifier: string;
  createdAt: any;
}

class HandleAudioResource extends ApiResponse {
  constructor(
    data: HandleAudioResourceProps | HandleAudioResourceProps[],
    error = "Sometihng went wrong while generating chat"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "response generated successfully"));
    }
  }
}

function formatData(data: HandleAudioResourceProps): any {
  return {
    id: data._id,
    text: data.text,
    chat: data.chat,
    speed: data.speed,
    language: data.language,
    audioFilePath: data.audioFilePath,
    voiceIdentifier: data.voiceIdentifier,
    createdAt: data.createdAt,
  };
}

export default HandleAudioResource;
