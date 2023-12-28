"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const user_1 = require("../lib/constants/user");
const userSchema = new mongoose_2.Schema({
    email: { type: String, required: false, unique: false, sparse: true },
    profileUrl: { type: String },
    userName: { type: String, required: false },
    password: { type: String, required: false, default: null },
    gmailProvider: { type: String, default: null, required: false },
    gmailProviderId: { type: String, default: null, required: false },
    appleProvider: { type: String, default: null, required: false },
    appleProviderId: { type: String, default: null, required: false },
    bio: { type: String, required: false, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number },
    otpExpiresAt: { type: Date },
    isOtpVerified: { type: Boolean, default: false },
    isReferralVerified: { type: Boolean, default: false },
    isRefferalCouponConsumed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    stripeId: { type: String, default: "" },
    subscription: { type: mongoose_2.Schema.Types.ObjectId, ref: "Subscription" },
    firstSubscription: { type: mongoose_2.Schema.Types.ObjectId, ref: "Subscription" },
    prevPlan: { type: mongoose_2.Schema.Types.ObjectId, ref: "Subscription" },
    subscriptionStripeId: { type: String, default: "" },
    subscribedDate: { type: Date },
    subscriptionRenewalDate: { type: Date },
    recurringHold: { type: Boolean, default: false },
    paymentMethod: { type: Boolean, default: false },
    referralSubscriptionConsumed: { type: Boolean },
    subscriptionReferralExpiration: { type: Date },
    referralSubscriptionId: { type: String },
    subscribedUser: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User" }],
    invitedReferralCode: { type: String },
    referralCode: { type: String },
    inviteUserCount: { type: Number },
    invitedUsers: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User" }],
    currentTransactionId: { type: mongoose_2.Schema.Types.ObjectId, ref: "Transaction" },
    stripeConnectAccountId: { type: String },
    imagesCount: { type: Number },
    audioCount: { type: Number },
    wordsCount: { type: Number },
    role: { type: String, required: true, default: user_1.USER_ROLES.USER },
    campaignId: { type: mongoose_2.Schema.Types.ObjectId, ref: "Compaign" },
    notificationsList: { type: mongoose_2.Schema.Types.Mixed, default: true },
    isRefferedAmountSentOnce: { type: Boolean, default: false },
    cancelSubscriptionEndDate: { type: Date }
}, { timestamps: true });
//userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(passport_local_mongoose_1.default, {
    usernameQueryFields: ["email", "gmailProviderId", "appleProviderId"], // Fields to use for authentication
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map