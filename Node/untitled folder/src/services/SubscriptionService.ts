import Subscription from "../models/Subscription";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import mongoose from "mongoose";
import User from "../models/User";
import { sendReferralEmail } from "../lib/helpers/sendReferralMail";
import Compains from "../models/Compain";
import BuyMore from "../models/BuyMore";
import Transaction from "../models/Transactions";
import { Socket } from "../classes/SocketIO";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import Notifications from "../models/Notifications";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const socket = new Socket();

class SubscriptionService {
  async store(req) {
    try {
      const { body, userId } = req;
      let { title, save, plans } = body;

      const package_plan: any = await Subscription.findOne({ title: title });

      if (package_plan) {
        await Subscription.updateOne(
          { _id: package_plan._id },
          {
            $set: {
              save: save,
              plans: plans,
            },
          }
        );
      } else {
        const newPlans = [];

        for (let i = 0; i < plans.length; i++) {
          const product = await stripe.products.create({
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
                interval:
                  title.toLowerCase().includes("monthly") ||
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

          newPlans.push({ ...plans[i], stripeId: product.id });
        }

        const subscription = await Subscription.create({
          title: title,
          save: save,
          plans: newPlans,
        });

        return { ...ObjectManipulator.distruct(subscription) };
      }
    } catch (err) {
      console.log("ererer", err);
    }
  }

  async index(req) {
    const subscriptions = await Subscription.find();

    if (!subscriptions) {
      throw new Error("No subscription plan found with this Id");
    }

    return subscriptions;
  }
  async show(req) {
    const { body } = req;
    const { subscriptionId } = body;
    const subscriptions = await Subscription.findById(subscriptionId);

    if (!subscriptions) {
      throw new Error("No subscription plan found with this Id");
    }

    return subscriptions;
  }
  //transaction Creation
  async getTransactionDates(payId: any) {
    try {
      const retrievedInt = await stripe.paymentIntents.retrieve(payId.id);
      const retrievedch = await stripe.charges.retrieve(payId.latest_charge);
      const retrievedTrans = await stripe.balanceTransactions.retrieve(
        retrievedch.balance_transaction
      );
      console.log(payId, " payment intent");
      console.log(retrievedInt, " retrieved intent");
      console.log(retrievedch, " retrieved charged");
      console.log(retrievedTrans, " retrieved transactoin");

      return { ...payId, available_on: retrievedTrans?.available_on };
    } catch (error) {
      console.log(error);
      throw new Error(error?.message ?? error);
    }
  }

  // stripe implementation
  async planSubscription(req) {
    try {
      const { body, userId } = req;
      const { planId, payId, isVerified } = body;

      let user = await User.findById(userId);

      const selectedPlan = await Subscription.findOne({
        "plans._id": new mongoose.Types.ObjectId(planId),
      });

      console.log(selectedPlan, " plan id");
      let payload = {
        user: userId,
        paymentId: payId,
        subscription: selectedPlan?._id,
        plan: planId,
        ...(isVerified ? { coupon: process.env.NEXT_PUBLIC_COUPON_ID } : {}),
      };

      if (user.campaignId && !(user.isRefferedAmountSentOnce == true)) {
        const comp = await Compains.findById(user.campaignId);
        payload["referralSuperUser"] = comp.creator;
        payload["isRefferedAmount"] = true;
        payload["campaignId"] = user.campaignId;
        await User.findByIdAndUpdate(userId, {
          $set: { isRefferedAmountSentOnce: true },
        });
      }

      const createdTransaction = await Transaction.create(payload);

      let attach = false;

      const plan = await Subscription.aggregate([
        {
          $match: { "plans._id": new mongoose.Types.ObjectId(planId) },
        },
        {
          $project: {
            plan: {
              $filter: {
                input: "$plans",
                as: "plan",
                cond: {
                  $eq: ["$$plan._id", new mongoose.Types.ObjectId(planId)],
                },
              },
            },
          },
        },
      ]);

      try {
        if (plan && user) {
          if (payId && !user.paymentMethod) {
            await stripe.paymentMethods.attach(payId, {
              customer: user.stripeId,
            });

            await stripe.customers.update(user.stripeId, {
              invoice_settings: { default_payment_method: payId },
            });

            attach = true;
          } else {
            if (!user.recurringHold) {
              const userPlan = await Subscription.findById(user.subscription);

              if (userPlan && userPlan?.type !== "free") {
                await stripe.subscriptions.cancel(user.subscriptionStripeId);
              }
            }
          }
          const planData = plan[0].plan[0];
          const product = await stripe.products.retrieve(planData.stripeId);
          const stripePayload = {
            customer: user.stripeId,
            items: [{ price: product.default_price }],
          };
          if (payload?.coupon && payload?.coupon !== "") {
            stripePayload["coupon"] = payload.coupon;
          }
          if (payload?.coupon && payload?.coupon !== "") {
            const currentUser = await User.findOne({ _id: userId });
            currentUser.isRefferalCouponConsumed = true;
            await currentUser.save();
          }

          const subscription = await stripe.subscriptions.create(stripePayload);

          console.log({subscription});

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
            subscriptionRenewalDate: next30Days.setDate(
              currentDate.getDate() + 30
            ),
            currentTransactionId: createdTransaction._id,
          };
          if (!user.subscription || !user.firstSubscription) {
            payload1["firstSubscription"] = planId;
            if (user?.campaignId) {
              const comp = await Compains.findById(user.campaignId);
              if (comp) {
                const rcUser = comp?._doc?.creator ?? comp?.creator;
                const notification = {
                  title: "Campaign User Registered",
                  user: rcUser,
                  name: SOCKET_EVENT_TYPES.CAMPAIGN_INVITE,
                  message: `${user?.userName} has bought a subscription with your campaign.`,
                  from: user?._id ?? user?._doc?._id,
                  receivers: [rcUser],
                };

                const notifications = new Notifications(notification);
                await notifications.save();

                socket.emit(SOCKET_EVENT_TYPES.CAMPAIGN_INVITE, {
                  isNotification: true,
                  userIds: [rcUser]
                });
              }
            }
          }

          const updatedUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
              $set: payload1,
            },
            { new: true }
          );
          let referringUser;
          const subscriptions = await Subscription.findOne({
            title: "Monthly billing",
          });

          const packageWithTitleBasic = subscriptions.plans.find(
            (plan) => plan.title === "Basic"
          );

          if (packageWithTitleBasic) {
          } else {
            console.log('Package with title "Basic" not found.');
          }

          if (user.invitedReferralCode) {
            referringUser = await User.findOne({
              referralCode: user.invitedReferralCode,
            });

            // if (!referringUser) {
            //   throw new Error("Referring user not found.");
            // }
            if (referringUser) {

              referringUser.subscribedUser.push(user._id);
              await referringUser.save();
            }
            if (referringUser?.subscribedUser.length === 5) {
              referringUser.referralSubscriptionConsumed = true;
              referringUser.subscription = packageWithTitleBasic._id;
              referringUser.subscriptionReferralExpiration = new Date();
              referringUser.subscribedUser = [];
              referringUser.invitedUsers = [];
              referringUser.wordsCount = 0;
              referringUser.imagesCount = 0;
              referringUser.audioCount = 0;
              await referringUser.save();
              // socket.emit(`${SOCKET_EVENT_TYPES.REFERRAL_COMPLETED}_${referringUser?._id}`, {referringUser});
            }
            await sendReferralEmail(referringUser?.email);
          }
          return { ...ObjectManipulator.distruct(updatedUser) };
        } else {
        }
      } catch (error) {
        console.log(error.message);

        if (attach) {
          await stripe.paymentMethods.detach(payId);

          await stripe.customers.update(user.stripeId, {
            invoice_settings: { default_payment_method: null },
          });

          await User.updateOne(
            { _id: userId },
            {
              $unset: { subscription: 1 },
              $set: {
                subscriptionStripeId: "",
                paymentMethod: false,
                recurringHold: false,
                paymentStatus: "Failed",
              },
            }
          );
        }

        if(error && error.message){
          throw new Error(error.message);
        }
      }
    } catch (error) {
      if(error && error.message){
        throw new Error(error.message);
      }
    }
  }
  async createPaymentIntent(req) {
    try {
      const { userId } = req;
      const { payId, planId } = req.body;

      const buyMoreRecords = await BuyMore.findById(planId); // Assuming 'item' is the item being purchased
      //@ts-ignore
      const amountInCents = Math.round(buyMoreRecords.price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "eur", // Currency code (EUR for Euro)
        //@ts-ignore
        description: `Buy ${buyMoreRecords.type}`, // Description of the purchase
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
          await User.findByIdAndUpdate(userId, {
            $inc: { audioCount: audioCount },
          });
        }
        if (buyMoreRecords.type === "words") {
          let wordCount = -buyMoreRecords.limit;
          await User.findByIdAndUpdate(userId, {
            $inc: { wordsCount: wordCount },
          });
        }
        if (buyMoreRecords.type === "images") {
          let imageCount = -buyMoreRecords.limit;
          await User.findByIdAndUpdate(userId, {
            $inc: { imagesCount: imageCount },
          });
        }
      }

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  }

  async billingPortal(req) {
    const { userId } = req;
    let user = await User.findById(userId);

    const billingPortal = await stripe.billingPortal.sessions.create({
      customer: user.stripeId,
      return_url: `${process.env.FRONTEND_REDIRECT_URI}/chat`,
    });

    return billingPortal.url;
  }

  async verifyReferralCode(req) {
    const { userId } = req;
    const { referralCode } = req.body;

    try {
      const compaign = await Compains.findOne({ referralCode: referralCode });
      const user = await User.findOne({ referralCode: referralCode });
      const currentUser = await User.findOne({ _id: userId });
      if (currentUser?.isRefferalCouponConsumed === true) {
        throw new Error("Coupon already consumed");
      }
      const isVerified = compaign || user;
      if (isVerified) {
        return { status: "success", isVerified: true };
      } else {
        return { status: "error", isVerified: false };
      }
    } catch (error) {
      console.error(error, "error");
      return { status: "error", error: error.message };
    }
  }
}

export default new SubscriptionService();
