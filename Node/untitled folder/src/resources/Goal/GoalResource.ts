import ApiResponse from "../../lib/response/ApiResponse";

interface GoalResourceProps {
  _id: any;
  name: string;
  dueOnDate: string;
  keyPoint1: string;
  keyPoint2: string;
  keyPoint3: string;
  status: string;
  notificationsReminder: boolean;
  reminderFrequency: string;
  createdAt: string;
}

class HandleGoalResource extends ApiResponse {
  constructor(
    data: GoalResourceProps | GoalResourceProps[],
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "goal added successfully"));
    }
  }
}

function formatData(data: GoalResourceProps): any {
  return {
    id: data._id,
    name: data.name,
    status: data.status,
    dueOnDate: data.dueOnDate,
    keyPoint1: data.keyPoint1,
    keyPoint2: data.keyPoint2,
    keyPoint3: data.keyPoint3,
    createdAt: data.createdAt,
    reminderFrequency: data.reminderFrequency,
    notificationsReminder: data.notificationsReminder,
  };
}

export default HandleGoalResource;
