import ApiResponse from "../../lib/response/ApiResponse";

interface SubscriptionResourceProps {
  _id: any;
  title: string;
  type: string;
  priceSemester: number;
  priceMonth: number;
  priceYear: number;
  isRegular: boolean;
  referralPrice: number;
  description: string;
  save: string;
  plans: string;
  createdAt: number;
  updatedAt: boolean;
  imagesAllowed:number;
  wordsAllowed:Number;
  audioAllowed:Number;
}

class SubscriptionResource extends ApiResponse {
  constructor(
    data: SubscriptionResourceProps | SubscriptionResourceProps[],
    error = "Sometihing went wrong."
  ) {
    if (!data) {
      super(ApiResponse.error(error));
    } else {
      const formattedData = Array.isArray(data)
        ? data.map(formatData)
        : formatData(data);
      super(ApiResponse.success(formattedData, "plan created successfully"));
    }
  }
}

function formatData(data: SubscriptionResourceProps): any {
  return {
    id: data._id,
    title: data.title,
    type: data.type,
    priceSemester: data.priceSemester,
    priceMonth: data.priceMonth,
    priceYear: data.priceYear,
    isRegular: data.isRegular,
    referralPrice: data.referralPrice,
    description: data.description,
    createdAt: data.createdAt,
    save: data.save,
    plans: data.plans,
    updatedAt: data.updatedAt,
    imagesAllowed:data.imagesAllowed,
    wordsAllowed:data.wordsAllowed,
    audioAllowed:data.audioAllowed,
  };
}

export default SubscriptionResource;
