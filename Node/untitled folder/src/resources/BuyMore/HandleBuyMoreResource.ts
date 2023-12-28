import ApiResponse from "../../lib/response/ApiResponse";

interface BuyMoresResourceProps {
  _id: any;
  title: string;
  type: string;
  price: number;
  limit: number;
}

class BuyMoreResource extends ApiResponse {
  constructor(
    data: BuyMoresResourceProps | BuyMoresResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "plan fetched successfully"));
    }
  }
}

function formatData(data: BuyMoresResourceProps): any {
  return {
    id: data._id,
    title: data.title,
    type: data.type,
    price: data.price,
    limit: data.limit,
  };
}

export default BuyMoreResource;
