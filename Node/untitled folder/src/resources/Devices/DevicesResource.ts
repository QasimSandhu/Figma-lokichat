import ApiResponse from "../../lib/response/ApiResponse";

interface DevicesResourceProps {
  _id: any;
  os: string;
  browserName: string;
  browserVersion: string;
  ipAddress: string;
  date: string;
  mobileId: string;
  mobileName: string;
}

class DevicesResource extends ApiResponse {
  constructor(
    data: DevicesResourceProps | DevicesResourceProps[],
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "device added successfully"));
    }
  }
}

function formatData(data: DevicesResourceProps): any {
  return {
    id: data._id,
    os: data.os,
    ipAddress: data.ipAddress,
    browserName: data.browserName,
    browserVersion: data.browserVersion,
    date: data.date,
    mobileId: data.mobileId,
    mobileName: data.mobileName,
  };
}

export default DevicesResource;
