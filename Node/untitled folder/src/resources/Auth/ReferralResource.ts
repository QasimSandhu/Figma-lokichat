import ApiResponse from "../../lib/response/ApiResponse";
import mongoose from "mongoose";

interface ReferralResourceProps {
  _id: string | mongoose.Types.ObjectId;
  userName: string;
  email: string;
  token: string;
  bio?: string;
  subscription?: string;
  profileUrl?: string;
  referralCode?: string;
  invitedUsers?: Array<any>;
  subscribedUser?: Array<any>;
  inviteUserCount?: any;
  imagesCount?: any;
  audioCount?: any;
  wordsCount?: any;
  ipAddress?: any;
  subscribedDate?: any;
  subscribedUserCount?: any;
  loggedInUsers?: any;
  loggedInUsersCount?: any;
  subscriptionsLeft?: number;
}

class ReferralResource extends ApiResponse {
  constructor(
    data: ReferralResourceProps | ReferralResourceProps[],
    error = "Invalid email or password"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "data fetched successful"));
    }
  }
}

function formatData(data: ReferralResourceProps): any {
  return {
    _id: data._id,
    email: data.email,
    userName: data.userName,
    subscription: data.subscription,
    invitedUsers: data.invitedUsers,
    subscribedUser: data.subscribedUser,
    inviteUserCount: data.inviteUserCount,
    imagesCount: data.imagesCount,
    audioCount: data.audioCount,
    wordsCount: data.wordsCount,
    profileUrl: data.profileUrl,
    subscribedDate: data.subscribedDate,
    loggedInUsersCount: data.loggedInUsersCount,
    loggedInUsers: data.loggedInUsers,
    subscribedUserCount: data.subscribedUserCount,
    subscriptionsLeft: data?.subscriptionsLeft,
  };
}

export default ReferralResource;
