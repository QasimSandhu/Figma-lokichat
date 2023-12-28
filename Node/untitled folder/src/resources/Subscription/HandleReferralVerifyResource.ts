import ApiResponse from "../../lib/response/ApiResponse";

interface ReferralVerifyResourceProps {
  isVerified: any;
}

class ReferralVerifyResource extends ApiResponse {
  constructor(
    data: ReferralVerifyResourceProps | ReferralVerifyResourceProps[],
    error = "Something went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);

      if (formattedData.isVerified) {
        super(ApiResponse.success(formattedData, "Verified successfully"));
      } else {
        super(ApiResponse.error("Verification failed"));
      }
    }
  }
}

function formatData(data: ReferralVerifyResourceProps): any {
  return {
    isVerified: data.isVerified,
  };
}

export default ReferralVerifyResource;
