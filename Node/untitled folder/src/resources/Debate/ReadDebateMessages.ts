import ApiResponse from "../../lib/response/ApiResponse";

interface DebateResourceProps {
  _id: any;
  user: string;
  title: string;
  invitedUsers: string;
  leavedDebateUsers?: any;
  messages: any[];
  createdAt: string;
}

class ReadDebateMessages extends ApiResponse {
  constructor(data: DebateResourceProps | DebateResourceProps[], error = "Sometihing went wrong.") {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      super(ApiResponse.success({}, "All debate messages marked as read"));
    }
  }
}
export default ReadDebateMessages;
