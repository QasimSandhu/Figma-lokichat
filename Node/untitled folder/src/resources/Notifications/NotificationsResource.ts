import ApiResponse from "../../lib/response/ApiResponse";

interface NotificationsResourceProps {
  _id: any;
  name: string;
  message: string;
  from: string;
  receivers: any;
  readBy: any;
  referenceId: string;
  createdAt: string;
}

class NotificationsResource extends ApiResponse {
  constructor(
    data: NotificationsResourceProps | NotificationsResourceProps[],
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "notificatiosn fetched successfully"));
    }
  }
}

function formatData(data: NotificationsResourceProps): any {
  return {
    id: data._id,
    name: data.name,
    from: data.from,
    readBy: data.readBy,
    message: data.message,
    receivers: data.receivers,
    referenceId: data.referenceId,
    createdAt: data.createdAt
  };
}

export default NotificationsResource;