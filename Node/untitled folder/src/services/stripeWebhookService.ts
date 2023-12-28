import Subscription from "../models/Subscription";
import User from "../models/User";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


class stripeWebhookService {

  async stripeWebhook(req, res, next) {
    try {
        const event = req.body;

        let updatedUser = null; 

        switch (event.type) {
            case 'customer.subscription.created':
                // Handle subscription created event
                await User.updateOne(
                  { stripeId: event.data.object.customer },
                  {
                      $set: {
                          subscription: event.data.object.plan.product
                      },
                  }
              );

              // Fetch the updated user after the update
              updatedUser = await User.findOne({ stripeId: event.data.object.customer });
                break;

            case 'customer.subscription.deleted':
                // Handle subscription deleted event
                await User.updateOne(
                    { stripeId: event.data.object.customer },
                    {
                        $unset: {
                            subscription: 1,
                            cancelSubscriptionEndDate: 1
                        },
                    }
                );

                // Fetch the updated user after the update
                updatedUser = await User.findOne({ stripeId: event.data.object.customer });

                break;

            case 'customer.subscription.updated':
                // Handle subscription updated event

                const customerSubscriptionUpdated = event.data.object;
                const customerSubscriptionUpdatedPlanId = customerSubscriptionUpdated.plan.product;

                const userPlan = await Subscription.findOne({ 'plans.stripeId': customerSubscriptionUpdatedPlanId });
                let matchingPlan;
                if (userPlan) {
                    matchingPlan = userPlan.plans.find((plan) => plan.stripeId === customerSubscriptionUpdatedPlanId);
                }

                if (customerSubscriptionUpdated.cancellation_details.reason === 'cancellation_requested') {
                    await User.updateOne(
                        { stripeId: event.data.object.customer },
                        {
                            $set: {
                                cancelSubscriptionEndDate: new Date(event.data.object.current_period_end * 1000),
                            },
                        }
                    );
                } else {
                    await User.updateOne(
                        { stripeId: event.data.object.customer },
                        {
                            $set: {
                                subscription: matchingPlan._id,
                            },
                        }
                    );
                }

                // Fetch the updated user after the update
                updatedUser = await User.findOne({ stripeId: event.data.object.customer });

                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
console.log(updatedUser,"updatedUser");

        if (updatedUser) {
            return (updatedUser);
        } else {
            return ({ message: 'Event processed successfully' });
        }
    } catch (error) {
        console.log(error);
        // retur(500).json({ error: 'An error occurred' });
        throw new Error("An error occurred")
    }
}

}

export default new stripeWebhookService();