import ApiResponse from "../../lib/response/ApiResponse";
import mongoose from "mongoose";

interface GoogleLoginResourceProps {
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
  refreshToken?: string;
  gmailProvider?: string;
  gmailProviderId?: string;
  appleProvider?: string;
  appleProviderId?: string;
  role?: string;
  subscribedDate?:any;
  isReferralVerified?:any
}

class GoogleLoginResource extends ApiResponse {
  constructor(
    data: GoogleLoginResourceProps | GoogleLoginResourceProps[],
    error = "Invalid email or password",
    status= 200
  ) {
    if (!data) {
      super(ApiResponse.error(error, null, status));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.error( "Enter valid referral code to login.",formattedData, 200));
    }
  }
}

function formatData(data: GoogleLoginResourceProps): any {
  return {
    id: data._id,
    email: data.email,
    userName: data.userName,
    token: data.token,
    bio: data.bio,
    subscription: data.subscription,
    profileUrl: data.profileUrl,
    referralCode: data.referralCode,
    invitedUsers: data.invitedUsers,
    subscribedUser: data.subscribedUser,
    refreshToken: data.refreshToken,
    gmailProvider: data.gmailProvider,
    gmailProviderId: data.gmailProviderId,
    appleProvider: data.appleProvider,
    appleProviderId: data.appleProviderId,
    role: data.role,
    subscribedDate:data.subscribedDate,
    isReferralVerified:data.isReferralVerified
  };
}

export default GoogleLoginResource;
