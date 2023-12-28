import ApiResponse from "../../lib/response/ApiResponse";

interface DebateResourceProps {
  _id: any;
  title: string;
  invitedUsers: string;
  messages: any[];
  unreadMessages: number;
  createdAt: string;
  updatedAt: string;
}
interface DebateResourcePaginationProps {
  debates: DebateResourceProps;
  currentPage: number;
  pages: number;
  totalDebates: number;
  perPage: string;
  isAvailableRecords?: any;
}

class DebateResourcePagination extends ApiResponse {
  constructor(
    data: DebateResourcePaginationProps,
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = formatData(data);
      super(ApiResponse.success(formattedData, "debates fetched successfully"));
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
    createdAt: message.createdAt,
  };
}

function formatDebates(debates: DebateResourceProps) {
  const formattedMessages = debates.messages?.map(formatMessage);
  return {
    id: debates._id,
    title: debates.title,
    invitedUsers: debates.invitedUsers,
    messages: formattedMessages,
    unreadMessages: debates.unreadMessages,
    createdAt: debates.createdAt,
    updatedAt: debates.updatedAt,
  };
}

function formatData(data: DebateResourcePaginationProps): any {
  const formattedDebates = Array.isArray(data.debates)
    ? data.debates.map(formatDebates)
    : formatDebates(data.debates);
  return {
    debates: formattedDebates,
    currentPage: data.currentPage,
    pages: data.pages,
    totalDebates: data.totalDebates,
    perPage: data.perPage,
    isAvailableRecords: data.isAvailableRecords
  };
}

export default DebateResourcePagination;
