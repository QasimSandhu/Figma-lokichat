import ApiResponse from "../../lib/response/ApiResponse";

interface ImageResources {
    _id: string;
    prompt: any;
    imagePathUrls: string[];
    createdAt: any;
    eta: number;
    imageId: number | null;
}

interface ImageLibrarayResourcesProps {
    images: ImageResources[];
    totalCount: number;
}

class ImageLibraryResources extends ApiResponse {
  constructor(
    data: ImageLibrarayResourcesProps,
    error = "Sometihng went wrong while fetching Images"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data.images)
        ? data.images.map(formatData)
        : formatData(data.images);
        const returnedFormattedData = { totalCount: data.totalCount, images: formattedData}
      super(ApiResponse.success(returnedFormattedData, "Image Library Fetched Successfully!"));
    }
  }
}

function formatData(data: ImageResources): any {
  return {
    id: data._id,
    eta: data.eta,
    prompt: data.prompt,
    imageId: data.imageId,
    createdAt: data.createdAt,
    imagePathUrls: data.imagePathUrls,

  };
}

export default ImageLibraryResources;
