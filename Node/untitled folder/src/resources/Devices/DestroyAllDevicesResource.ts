import ApiResponse from "../../lib/response/ApiResponse";

interface DestroyAllDevicesProps {
    deletedCount: number;
    acknowledged: boolean;
}

class DestroyAllDevices extends ApiResponse {
  constructor(
    data: DestroyAllDevicesProps,
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = formatData(data);
      super(ApiResponse.success(formattedData, "user logged out from all devices"));
    }
  }
}

function formatData(data: DestroyAllDevicesProps): any {
  return {
    deletedCount: data.deletedCount,
    acknowledged: data.acknowledged
  };
}

export default DestroyAllDevices;
