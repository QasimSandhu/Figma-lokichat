import ApiResponse from "../../lib/response/ApiResponse";

interface GoalDataResourceProps {
  _id: any;
  name: string;
  status: string;
  dueOnDate: string;
  keyPoint1: string;
  keyPoint2: string;
  keyPoint3: string;
  completedAt: string;
  notificationsReminder: boolean;
  reminderFrequency: string;
  createdAt: string;
}

interface GetGoalData {
    goals: GoalDataResourceProps;
    currentPage: string;
    pages: string;
    totalChats: string;
    perPage?: any;
}

class GetGoalResource extends ApiResponse {
  constructor(
    data: GetGoalData,
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedGoals = Array.isArray(data.goals)
        ? data.goals.map(formatData)
        : formatData(data.goals);
        data.goals = formattedGoals;
        const formattedData = data;
      super(ApiResponse.success(formattedData, "goals fetched successfully"));
    }
  }
}

function formatData(data: GoalDataResourceProps): any {
  return {
    id: data._id,
    name: data.name,
    status: data.status,
    dueOnDate: data.dueOnDate,
    keyPoint1: data.keyPoint1,
    keyPoint2: data.keyPoint2,
    keyPoint3: data.keyPoint3,
    createdAt: data.createdAt,
    completedAt: data.completedAt,
    reminderFrequency: data.reminderFrequency,
    notificationsReminder: data.notificationsReminder,
  };
}

export default GetGoalResource;
