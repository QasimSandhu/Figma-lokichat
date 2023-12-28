import ApiResponse from "../../lib/response/ApiResponse";

interface HandleProfileResourceProps {
  _id: any;
  email: any;
  avatar: any;
  userName: any;
  bio: any;
  profileUrl: string;
  subscription:any;
  referralCode?:any;
  gmailProvider?: string;
  gmailProviderId?: string;
  appleProvider?: string;
  appleProviderId?: string;
}

class HandleProfileResoruce extends ApiResponse {
  constructor(
    data: HandleProfileResourceProps | HandleProfileResourceProps[],
    error = "Sometihng went wrong while updating profile"
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "Pofile updated successfully"));
    }
  }
}

function formatData(data: HandleProfileResourceProps): any {
  return {
    id: data._id,
    email: data.email,
    avatar: data.avatar,
    userName: data.userName,
    bio: data.bio,
    profileUrl: data.profileUrl,
    subscription:data.subscription,
    referralCode:data.referralCode,
    gmailProvider: data.gmailProvider,
    gmailProviderId: data.gmailProviderId,
    appleProvider: data.appleProvider,
    appleProviderId: data.appleProviderId,
  };
}

export default HandleProfileResoruce;
