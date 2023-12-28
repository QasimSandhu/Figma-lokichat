import config from './config/config';
const mongoose = require('mongoose');
const cron = require('node-cron');
import User from './models/User';

// Function to reset expired free subscriptions for users
const resetExpiredSubscriptions = async () => {
  try {
    // Find users whose trial has expired (more than 30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const usersToResetFreeSubscription = await User.find({
  referralSubscriptionConsumed: true,
  subscriptionReferralExpiration: { $lt: thirtyDaysAgo },
});
    console.log(usersToResetFreeSubscription,"usersToResetFreeSubscription");

    // Reset free subscriptions for eligible users
    for (const user of usersToResetFreeSubscription) {
      user.subscription = null;
      user.referralSubscriptionConsumed = false;
      user.subscriptionReferralExpiration=null

      await user.save();
      console.log(`Free subscription reset for user ${user._id}`);
    }
  } catch (error) {
    console.error('Error resetting free subscriptions:', error);
  }
};


export const resetExpiraySubscriptionCrone=()=>{
  cron.schedule('0 0 * * *', async () => {
    // await applyFreeSubscriptions();
    await resetExpiredSubscriptions();
  }, {
    scheduled: true,
    timezone: 'Asia/Karachi',
  });
}

// Start the cron job
