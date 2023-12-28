import mongoose from "mongoose";
import { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import IUser from "../interfaces/IUser";
import { USER_ROLES } from "../lib/constants/user";

const userSchema = new Schema<any>(
  {
    email: { type: String, required: false, unique:false,sparse:true },
    profileUrl: { type: String },
    userName: { type: String, required: false },
    password: { type: String, required: false, default: null },
    gmailProvider: { type: String, default: null, required: false },
    gmailProviderId: { type: String, default: null ,required: false },
    appleProvider: { type: String, default: null, required: false },
    appleProviderId: { type: String, default: null ,required: false },
    bio: { type: String, required: false, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number },
    otpExpiresAt: { type: Date },
    isOtpVerified: { type: Boolean, default: false },
    isReferralVerified: { type: Boolean, default: false },
    isRefferalCouponConsumed:{ type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    stripeId: { type: String, default: "" },
    subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
    firstSubscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
    prevPlan: { type: Schema.Types.ObjectId, ref: "Subscription" },
    subscriptionStripeId: { type: String, default: "" },
    subscribedDate: { type: Date },
    subscriptionRenewalDate: { type: Date },
    recurringHold: { type: Boolean, default: false },
    paymentMethod: { type: Boolean, default: false },
    referralSubscriptionConsumed: { type: Boolean },
    subscriptionReferralExpiration: { type: Date },
    referralSubscriptionId: { type: String },
    subscribedUser: [{ type: Schema.Types.ObjectId, ref: "User" }],
    invitedReferralCode: { type: String },
    referralCode: { type: String },
    inviteUserCount: { type: Number },
    invitedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    currentTransactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    stripeConnectAccountId:{type:String},
    imagesCount: { type: Number },
    audioCount: { type: Number },
    wordsCount: { type: Number },
    role: { type: String, required: true, default: USER_ROLES.USER },
    campaignId: { type: Schema.Types.ObjectId, ref: "Compaign" },
    notificationsList: { type: Schema.Types.Mixed, default: true },
    isRefferedAmountSentOnce:{type:Boolean,default:false},
    cancelSubscriptionEndDate: { type: Date }
  },
  { timestamps: true }
);

//userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ["email", "gmailProviderId", "appleProviderId"],  // Fields to use for authentication
});

const User = mongoose.model<any>("User", userSchema);

export default User;
