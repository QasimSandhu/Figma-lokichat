import ApiResponse from "../../lib/response/ApiResponse";

interface UserNotificationsListResourceProps {
  _id: any;
  email: string;
  userName: string;
  createdAt: string;
  notificationsList: any;
}

class UserNotificationsList extends ApiResponse {
  constructor(
    data: UserNotificationsListResourceProps | UserNotificationsListResourceProps[],
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "notification list updated successfully"));
    }
  }
}

function formatData(data: UserNotificationsListResourceProps): any {
  return {
    id: data._id,
    email: data.email,
    userName: data.userName,
    createdAt: data.createdAt,
    notificationsList: data.notificationsList
  };
}

export default UserNotificationsList;