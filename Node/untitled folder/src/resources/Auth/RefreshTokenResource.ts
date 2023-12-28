import ApiResponse from "../../lib/response/ApiResponse";

interface RefreshTokenResourceProps {
  token: string;
  refreshToken: string;
}

class RefreshTokenResource extends ApiResponse {
  constructor(data: RefreshTokenResourceProps, error = "Server Error") {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = formatData(data);
      super(ApiResponse.success(formattedData, "Token refreshed successfully"));
    }
  }
}

function formatData(data: RefreshTokenResourceProps): any {
  return {
    token: data.token,
    refreshToken: data.refreshToken,
  };
}

export default RefreshTokenResource;
