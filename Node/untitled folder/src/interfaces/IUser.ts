import mongoose from 'mongoose';

  export default interface IUser extends mongoose.PassportLocalModel<any> {
  id: string;
  profileUrl: string;
  email: string;
  userName: string;
  password: string;
  gmailProvider: string;
  gmailProviderId: string;
  appleProvider: string;
  appleProviderId: string;
  isVerified: boolean;
  otp: number;
  bio: string;
  otpExpiresAt: Date | string;
  isOtpVerified: boolean;
  isDeleted: boolean;
  stripeId: string;
  stripeConnectAccountId?:string;
  subscription: any;
  prevPlan: any;
  subscriptionStripeId: string;
  subscribedDate: Date;
  recurringHold: Boolean;
  paymentMethod: Boolean;
  referralCode: string;
  invitedUsers?: Array<any>;
  subscribedUser?: Array<any>;
  invitedReferralCode?: any;
  referralSubscriptionId?: any;
  referralSubscriptionConsumed?: any;
  subscriptionReferralExpiration?: any;
  inviteUserCount?: any;
  imagesCount?: Number;
  audioCount?: Number;
  wordsCount?: Number;
  compaignName: string;
  subscriptionRenewalDate: Date;
  role: string;
  campaignId: any;
  notificationsList: any;
  currentTransactionId?:any;
  isRefferedAmountSentOnce?:boolean;
  firstSubscription?:any;
  cancelSubscriptionEndDate?:Date
}
