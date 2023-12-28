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
const User_1 = __importDefault(require("../models/User"));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
class stripeWebhookService {
    stripeWebhook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = req.body;
                let updatedUser = null;
                switch (event.type) {
                    case 'customer.subscription.created':
                        // Handle subscription created event
                        yield User_1.default.updateOne({ stripeId: event.data.object.customer }, {
                            $set: {
                                subscription: event.data.object.plan.product
                            },
                        });
                        // Fetch the updated user after the update
                        updatedUser = yield User_1.default.findOne({ stripeId: event.data.object.customer });
                        break;
                    case 'customer.subscription.deleted':
                        // Handle subscription deleted event
                        yield User_1.default.updateOne({ stripeId: event.data.object.customer }, {
                            $unset: {
                                subscription: 1,
                                cancelSubscriptionEndDate: 1
                            },
                        });
                        // Fetch the updated user after the update
                        updatedUser = yield User_1.default.findOne({ stripeId: event.data.object.customer });
                        break;
                    case 'customer.subscription.updated':
                        // Handle subscription updated event
                        const customerSubscriptionUpdated = event.data.object;
                        const customerSubscriptionUpdatedPlanId = customerSubscriptionUpdated.plan.product;
                        const userPlan = yield Subscription_1.default.findOne({ 'plans.stripeId': customerSubscriptionUpdatedPlanId });
                        let matchingPlan;
                        if (userPlan) {
                            matchingPlan = userPlan.plans.find((plan) => plan.stripeId === customerSubscriptionUpdatedPlanId);
                        }
                        if (customerSubscriptionUpdated.cancellation_details.reason === 'cancellation_requested') {
                            yield User_1.default.updateOne({ stripeId: event.data.object.customer }, {
                                $set: {
                                    cancelSubscriptionEndDate: new Date(event.data.object.current_period_end * 1000),
                                },
                            });
                        }
                        else {
                            yield User_1.default.updateOne({ stripeId: event.data.object.customer }, {
                                $set: {
                                    subscription: matchingPlan._id,
                                },
                            });
                        }
                        // Fetch the updated user after the update
                        updatedUser = yield User_1.default.findOne({ stripeId: event.data.object.customer });
                        break;
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                }
                console.log(updatedUser, "updatedUser");
                if (updatedUser) {
                    return (updatedUser);
                }
                else {
                    return ({ message: 'Event processed successfully' });
                }
            }
            catch (error) {
                console.log(error);
                // retur(500).json({ error: 'An error occurred' });
                throw new Error("An error occurred");
            }
        });
    }
}
exports.default = new stripeWebhookService();
//# sourceMappingURL=stripeWebhookService.js.map