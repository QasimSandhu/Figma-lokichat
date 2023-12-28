import ApiResponse from "../../lib/response/ApiResponse";

interface SuperUserResourceProps {
  _id: string;
  user: any;
  description: string;
  website?: string;
  socialInfo: any[];
  approvedBy: any;
  status: string;
  statusUpdatedDate: Date;
  createdAt: Date;
}

class SuperUserResource extends ApiResponse {
  constructor(
    data: SuperUserResourceProps | SuperUserResourceProps[],
    error = "Sometihing went wrong."
  ) {

    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);

      super(ApiResponse.success(formattedData, " superuser created successfully"));
    }
  }
}

function formatData(data: SuperUserResourceProps): any {
  const formattedSocialInfo = data.socialInfo.map(formatSocialInfo)
  return {
    id: data._id,
    user: data.user,
    status: data.status,
    website: data.website,
    approvedBy: data.approvedBy,
    description: data.description,
    socialInfo: formattedSocialInfo || [],
    statusUpdatedDate: data.statusUpdatedDate,
    createdAt: data.createdAt,
  };

  function formatSocialInfo(data: any): any {
    return {
      id: data._id,
      userName: data.userName,
      platform: data.platform,
    }
  }
}

export default SuperUserResource;
