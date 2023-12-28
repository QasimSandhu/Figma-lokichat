import ApiResponse from "../../lib/response/ApiResponse";

interface ImageLibrarayResourceProps {
    _id: string;
    prompt: any;
    imagePathUrls: string[];
    createdAt: any;
    eta: number;
    imageId: number | null;
}

class ImageLibraryResource extends ApiResponse {
  constructor(
    data: ImageLibrarayResourceProps,
    error = "Sometihng went wrong while fetching Images"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "Imagge Library Fetched Successfully!"));
    }
  }
}

function formatData(data: ImageLibrarayResourceProps): any {
  return {
    id: data._id,
    eta: data.eta,
    prompt: data.prompt,
    imageId: data.imageId,
    createdAt: data.createdAt,
    imagePathUrls: data.imagePathUrls,
  };
}

export default ImageLibraryResource;
