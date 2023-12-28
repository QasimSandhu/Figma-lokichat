import ApiResponse from "../../lib/response/ApiResponse";

interface DebateResourceProps {
  _id: any;
  user: string;
  title: string;
  invitedUsers: string[];
  leavedDebateUsers?: any;
  removedDebateUsers?: any;
  messages: any[];
  createdAt: string;
}

class DebateResource extends ApiResponse {
  constructor(
    data: DebateResourceProps | DebateResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "debate created successfully"));
    }
  }
}

function formatMessage(message: any): any {
  return {
    id: message._id,
    sender: message.sender,
    message: message.message,
    mentionedUsers: message.mentionedUsers,
    isBotMentioned: message.isBotMentioned,
    isBotResponse: message.isBotResponse,
    responseTo: message.responseTo,
    createdAt: message.createdAt
  };
}

function formatUsers(invitedUserObj: any): any {
  const user: any  = invitedUserObj.user;
  // return {
    // user._id: message._id,
    // user.sender: message.sender,
    // user.message: message.message,
  // };
  return user;
}

function formatData(data: DebateResourceProps): any {
  const formattedMessages = data.messages?.map(formatMessage)
  const formattedInvitedUsers = data.invitedUsers?.map(formatUsers)
  return {
    id: data._id,
    user: data.user,
    title: data.title,
    invitedUsers: formattedInvitedUsers,
    leavedDebateUsers: data.leavedDebateUsers,
    removedDebateUsers: data.removedDebateUsers,
    messages: formattedMessages,
    createdAt: data.createdAt
  };
}

export default DebateResource;
