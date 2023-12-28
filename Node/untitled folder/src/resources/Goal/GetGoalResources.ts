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
    inProgressGoals: GoalDataResourceProps;
    completedGoals: GoalDataResourceProps;
}

class GetGoalResource extends ApiResponse {
  constructor(
    data: GetGoalData,
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedCompletedGoals = Array.isArray(data.completedGoals)
        ? data.completedGoals.map(formatData)
        : formatData(data.completedGoals);
        const formattedInProgressGoals = Array.isArray(data.inProgressGoals)
        ? data.inProgressGoals.map(formatData)
        : formatData(data.inProgressGoals);
        const formattedData = { completedGoals: formattedCompletedGoals, inProgressGoals: formattedInProgressGoals }
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
