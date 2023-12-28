"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Subscription_1 = __importDefault(require("../models/Subscription"));
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const sendReferralMail_1 = require("../lib/helpers/sendReferralMail");
const Compain_1 = __importDefault(require("../models/Compain"));
const BuyMore_1 = __importDefault(require("../models/BuyMore"));
const Transactions_1 = __importDefault(require("../models/Transactions"));
const SocketIO_1 = require("../classes/SocketIO");
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const socket = new SocketIO_1.Socket();
class SubscriptionService {
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, userId } = req;
                let { title, save, plans } = body;
                const package_plan = yield Subscription_1.default.findOne({ title: title });
                if (package_plan) {
                    yield Subscription_1.default.updateOne({ _id: package_plan._id }, {
                        $set: {
                            save: save,
                            plans: plans,
                        },
                    });
                }
                else {
                    const newPlans = [];
                    for (let i = 0; i < plans.length; i++) {
                        const product = yield stripe.products.create({
                            name: plans[i].title,
                            description: plans[i].description,
                            metadata: {
                                popular: plans[i].popular,
                                priceDetails: plans[i].priceDetails,
                            },
                            default_price_data: {
                                currency: "eur",
                                unit_amount: plans[i].price * 100,
                                recurring: {
                                    interval: title.toLowerCase().includes("monthly") ||
                                        title.toLowerCase().includes("semester")
                                        ? "month"
                                        : "year",
                                    interval_count: title.toLowerCase().includes("monthly")
                                        ? 1
                                        : title.toLowerCase().includes("semester")
                                            ? 6
                                            : 1,
                                },
                            },
                        });
                        newPlans.push(Object.assign(Object.assign({}, plans[i]), { stripeId: product.id }));
                    }
                    const subscription = yield Subscription_1.default.create({
                        title: title,
                        save: save,
                        plans: newPlans,
                    });
                    return Object.assign({}, ObjectDestructurer_1.default.distruct(subscription));
                }
            }
            catch (err) {
                console.log("ererer", err);
            }
        });
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptions = yield Subscription_1.default.find();
            if (!subscriptions) {
                throw new Error("No subscription plan found with this Id");
            }
            return subscriptions;
        });
    }
    show(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { subscriptionId } = body;
            const subscriptions = yield Subscription_1.default.findById(subscriptionId);
            if (!subscriptions) {
                throw new Error("No subscription plan found with this Id");
            }
            return subscriptions;
        });
    }
    //transaction Creation
    getTransactionDates(payId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const retrievedInt = yield stripe.paymentIntents.retrieve(payId.id);
                const retrievedch = yield stripe.charges.retrieve(payId.latest_charge);
                const retrievedTrans = yield stripe.balanceTransactions.retrieve(retrievedch.balance_transaction);
                console.log(payId, " payment intent");
                console.log(retrievedInt, " retrieved intent");
                console.log(retrievedch, " retrieved charged");
                console.log(retrievedTrans, " retrieved transactoin");
                return Object.assign(Object.assign({}, payId), { available_on: retrievedTrans === null || retrievedTrans === void 0 ? void 0 : retrievedTrans.available_on });
            }
            catch (error) {
                console.log(error);
                throw new Error((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
            }
        });
    }
    // stripe implementation
    planSubscription(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, userId } = req;
                const { planId, payId, isVerified } = body;
                let user = yield User_1.default.findById(userId);
                const selectedPlan = yield Subscription_1.default.findOne({
                    "plans._id": new mongoose_1.default.Types.ObjectId(planId),
                });
                console.log(selectedPlan, " plan id");
                let payload = Object.assign({ user: userId, paymentId: payId, subscription: selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan._id, plan: planId }, (isVerified ? { coupon: process.env.NEXT_PUBLIC_COUPON_ID } : {}));
                if (user.campaignId && !(user.isRefferedAmountSentOnce == true)) {
                    const comp = yield Compain_1.default.findById(user.campaignId);
                    payload["referralSuperUser"] = comp.creator;
                    payload["isRefferedAmount"] = true;
                    payload["campaignId"] = user.campaignId;
                    yield User_1.default.findByIdAndUpdate(userId, {
                        $set: { isRefferedAmountSentOnce: true },
                    });
                }
                const createdTransaction = yield Transactions_1.default.create(payload);
                let attach = false;
                const plan = yield Subscription_1.default.aggregate([
                    {
                        $match: { "plans._id": new mongoose_1.default.Types.ObjectId(planId) },
                    },
                    {
                        $project: {
                            plan: {
                                $filter: {
                                    input: "$plans",
                                    as: "plan",
                                    cond: {
                                        $eq: ["$$plan._id", new mongoose_1.default.Types.ObjectId(planId)],
                                    },
                                },
                            },
                        },
                    },
                ]);
                try {
                    if (plan && user) {
                        if (payId && !user.paymentMethod) {
                            yield stripe.paymentMethods.attach(payId, {
                                customer: user.stripeId,
                            });
                            yield stripe.customers.update(user.stripeId, {
                                invoice_settings: { default_payment_method: payId },
                            });
                            attach = true;
                        }
                        else {
                            if (!user.recurringHold) {
                                const userPlan = yield Subscription_1.default.findById(user.subscription);
                                if (userPlan && (userPlan === null || userPlan === void 0 ? void 0 : userPlan.type) !== "free") {
                                    yield stripe.subscriptions.cancel(user.subscriptionStripeId);
                                }
                            }
                        }
                        const planData = plan[0].plan[0];
                        const product = yield stripe.products.retrieve(planData.stripeId);
                        const stripePayload = {
                            customer: user.stripeId,
                            items: [{ price: product.default_price }],
                        };
                        if ((payload === null || payload === void 0 ? void 0 : payload.coupon) && (payload === null || payload === void 0 ? void 0 : payload.coupon) !== "") {
                            stripePayload["coupon"] = payload.coupon;
                        }
                        if ((payload === null || payload === void 0 ? void 0 : payload.coupon) && (payload === null || payload === void 0 ? void 0 : payload.coupon) !== "") {
                            const currentUser = yield User_1.default.findOne({ _id: userId });
                            currentUser.isRefferalCouponConsumed = true;
                            yield currentUser.save();
                        }
                        const subscription = yield stripe.subscriptions.create(stripePayload);
                        console.log({ subscription });
                        const currentDate = new Date();
                        const next30Days = new Date(currentDate);
                        const payload1 = {
                            subscription: planId,
                            subscriptionStripeId: subscription.id,
                            paymentMethod: false,
                            recurringHold: false,
                            paymentStatus: "InProcess",
                            subscribedDate: new Date(),
                            wordsCount: 0,
                            audioCount: 0,
                            imagesCount: 0,
                            subscriptionRenewalDate: next30Days.setDate(currentDate.getDate() + 30),
                            currentTransactionId: createdTransaction._id,
                        };
                        if (!user.subscription || !user.firstSubscription) {
                            payload1["firstSubscription"] = planId;
                            if (user === null || user === void 0 ? void 0 : user.campaignId) {
                                const comp = yield Compain_1.default.findById(user.campaignId);
                                if (comp) {
                                    const rcUser = (_b = (_a = comp === null || comp === void 0 ? void 0 : comp._doc) === null || _a === void 0 ? void 0 : _a.creator) !== null && _b !== void 0 ? _b : comp === null || comp === void 0 ? void 0 : comp.creator;
                                    const notification = {
                                        title: "Campaign User Registered",
                                        user: rcUser,
                                        name: notificationsTypes_1.SOCKET_EVENT_TYPES.CAMPAIGN_INVITE,
                                        message: `${user === null || user === void 0 ? void 0 : user.userName} has bought a subscription with your campaign.`,
                                        from: (_c = user === null || user === void 0 ? void 0 : user._id) !== null && _c !== void 0 ? _c : (_d = user === null || user === void 0 ? void 0 : user._doc) === null || _d === void 0 ? void 0 : _d._id,
                                        receivers: [rcUser],
                                    };
                                    const notifications = new Notifications_1.default(notification);
                                    yield notifications.save();
                                    socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.CAMPAIGN_INVITE, {
                                        isNotification: true,
                                        userIds: [rcUser]
                                    });
                                }
                            }
                        }
                        const updatedUser = yield User_1.default.findByIdAndUpdate({ _id: userId }, {
                            $set: payload1,
                        }, { new: true });
                        let referringUser;
                        const subscriptions = yield Subscription_1.default.findOne({
                            title: "Monthly billing",
                        });
                        const packageWithTitleBasic = subscriptions.plans.find((plan) => plan.title === "Basic");
                        if (packageWithTitleBasic) {
                        }
                        else {
                            console.log('Package with title "Basic" not found.');
                        }
                        if (user.invitedReferralCode) {
                            referringUser = yield User_1.default.findOne({
                                referralCode: user.invitedReferralCode,
                            });
                            // if (!referringUser) {
                            //   throw new Error("Referring user not found.");
                            // }
                            if (referringUser) {
                                referringUser.subscribedUser.push(user._id);
                                yield referringUser.save();
                            }
                            if ((referringUser === null || referringUser === void 0 ? void 0 : referringUser.subscribedUser.length) === 5) {
                                referringUser.referralSubscriptionConsumed = true;
                                referringUser.subscription = packageWithTitleBasic._id;
                                referringUser.subscriptionReferralExpiration = new Date();
                                referringUser.subscribedUser = [];
                                referringUser.invitedUsers = [];
                                referringUser.wordsCount = 0;
                                referringUser.imagesCount = 0;
                                referringUser.audioCount = 0;
                                yield referringUser.save();
                                // socket.emit(`${SOCKET_EVENT_TYPES.REFERRAL_COMPLETED}_${referringUser?._id}`, {referringUser});
                            }
                            yield (0, sendReferralMail_1.sendReferralEmail)(referringUser === null || referringUser === void 0 ? void 0 : referringUser.email);
                        }
                        return Object.assign({}, ObjectDestructurer_1.default.distruct(updatedUser));
                    }
                    else {
                    }
                }
                catch (error) {
                    console.log(error.message);
                    if (attach) {
                        yield stripe.paymentMethods.detach(payId);
                        yield stripe.customers.update(user.stripeId, {
                            invoice_settings: { default_payment_method: null },
                        });
                        yield User_1.default.updateOne({ _id: userId }, {
                            $unset: { subscription: 1 },
                            $set: {
                                subscriptionStripeId: "",
                                paymentMethod: false,
                                recurringHold: false,
                                paymentStatus: "Failed",
                            },
                        });
                    }
                    if (error && error.message) {
                        throw new Error(error.message);
                    }
                }
            }
            catch (error) {
                if (error && error.message) {
                    throw new Error(error.message);
                }
            }
        });
    }
    createPaymentIntent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const { payId, planId } = req.body;
                const buyMoreRecords = yield BuyMore_1.default.findById(planId); // Assuming 'item' is the item being purchased
                //@ts-ignore
                const amountInCents = Math.round(buyMoreRecords.price * 100);
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: amountInCents,
                    currency: "eur",
                    //@ts-ignore
                    description: `Buy ${buyMoreRecords.type}`,
                    metadata: {
                        //@ts-ignore
                        itemId: buyMoreRecords.id,
                    },
                    payment_method: payId,
                    confirm: true,
                    automatic_payment_methods: {
                        enabled: true,
                        allow_redirects: "never",
                    },
                });
                if (paymentIntent.client_secret) {
                    if (buyMoreRecords.type === "minutes") {
                        let audioCount = -buyMoreRecords.limit;
                        yield User_1.default.findByIdAndUpdate(userId, {
                            $inc: { audioCount: audioCount },
                        });
                    }
                    if (buyMoreRecords.type === "words") {
                        let wordCount = -buyMoreRecords.limit;
                        yield User_1.default.findByIdAndUpdate(userId, {
                            $inc: { wordsCount: wordCount },
                        });
                    }
                    if (buyMoreRecords.type === "images") {
                        let imageCount = -buyMoreRecords.limit;
                        yield User_1.default.findByIdAndUpdate(userId, {
                            $inc: { imagesCount: imageCount },
                        });
                    }
                }
                return { clientSecret: paymentIntent.client_secret };
            }
            catch (error) {
                console.error("Error creating payment intent:", error);
            }
        });
    }
    billingPortal(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            let user = yield User_1.default.findById(userId);
            const billingPortal = yield stripe.billingPortal.sessions.create({
                customer: user.stripeId,
                return_url: `${process.env.FRONTEND_REDIRECT_URI}/chat`,
            });
            return billingPortal.url;
        });
    }
    verifyReferralCode(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { referralCode } = req.body;
            try {
                const compaign = yield Compain_1.default.findOne({ referralCode: referralCode });
                const user = yield User_1.default.findOne({ referralCode: referralCode });
                const currentUser = yield User_1.default.findOne({ _id: userId });
                if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isRefferalCouponConsumed) === true) {
                    throw new Error("Coupon already consumed");
                }
                const isVerified = compaign || user;
                if (isVerified) {
                    return { status: "success", isVerified: true };
                }
                else {
                    return { status: "error", isVerified: false };
                }
            }
            catch (error) {
                console.error(error, "error");
                return { status: "error", error: error.message };
            }
        });
    }
}
exports.default = new SubscriptionService();
//# sourceMappingURL=SubscriptionService.js.map