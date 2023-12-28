import ApiResponse from "../../lib/response/ApiResponse";

interface GoalStatsResourceProps {
  _id: any;
  totalInProgressGoals: number;
  totalCompletedGoals: number;
}

class GoalStatsResource extends ApiResponse {
  constructor(
    data: GoalStatsResourceProps | GoalStatsResourceProps[],
    error = "Sometihng went wrong"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "goal stats fetched successfully"));
    }
  }
}

function formatData(data: GoalStatsResourceProps): any {
  return {
    id: data._id,
    totalInProgressGoals: data.totalInProgressGoals,
    totalCompletedGoals: data.totalCompletedGoals
  };
}

export default GoalStatsResource;
