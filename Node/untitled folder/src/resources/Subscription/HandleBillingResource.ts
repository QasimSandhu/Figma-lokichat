import ApiResponse from "../../lib/response/ApiResponse";

interface BillingResourceProps {
  url: any;
}

class BillingResource extends ApiResponse {
  constructor(
    data: BillingResourceProps | BillingResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(data, "Url Fetched successfully"));
    }
  }
}

function formatData(data: BillingResourceProps): any {
  return {
    url: data,
  };
}

export default BillingResource;
