import ApiResponse from "../../lib/response/ApiResponse";

interface PhotoGenerationResourceProps {
  _id: string;
  prompt: any;
  imagePathUrls: string[];
  createdAt: any;
  eta: number;
  imageId: number | null;
}

class PhotoGenerationResource extends ApiResponse {
  constructor(
    data: PhotoGenerationResourceProps | PhotoGenerationResourceProps[],
    error = "Sometihng went wrong while generating AI Photos"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "photo generated successfully"));
    }
  }
}

function formatData(data: PhotoGenerationResourceProps): any {
  return {
    id: data._id,
    eta: data.eta,
    prompt: data.prompt,
    imageId: data.imageId,
    createdAt: data.createdAt,
    imagePathUrls: data.imagePathUrls,
  };
}

export default PhotoGenerationResource;
