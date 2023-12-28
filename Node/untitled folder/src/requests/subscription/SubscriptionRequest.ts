import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from "class-validator";

  enum PlanType {
    Basic = "Basic",
    Premium = "Premium",
    Pro = "Pro",
  }

export class SubscriptionRequest {
  @IsDefined()
  @IsString()
  title!: string;

  @IsDefined()
  @IsString()
  type!: PlanType;
  
  @IsDefined()
  @IsNumber()
  priceSemester!: number;

  @IsDefined()
  @IsNumber()
  priceMonth!: number;

  @IsDefined()
  @IsNumber()
  priceYear!: number;
  
  @IsOptional()
  @IsBoolean()
  isRegular!: boolean;

  @IsOptional()
  @IsNumber()
  referralPrice!: number;

  @IsDefined()
  @IsString()
  description!: string;

  constructor(request) {
    this.title = request?.body?.title;
    this.type = request?.body?.type;
    this.priceMonth = request?.body?.priceSemester;
    this.priceMonth = request?.body?.priceMonth;
    this.priceYear = request?.body?.priceYear;
    this.isRegular = request?.body?.isRegular;
    this.referralPrice = request?.body?.referralPrice;
    this.description = request?.body?.description;
  }
}

export class ShowPlanRequest {

  constructor(request) {}
}