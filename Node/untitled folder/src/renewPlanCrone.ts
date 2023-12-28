const cron = require('node-cron');
import Subscription from './models/Subscription';
import User from './models/User';

export const resetPlanData= () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0); // Set the time to midnight in UTC
      const next30Days = new Date(currentDate);
      next30Days.setDate(currentDate.getDate() + 30);
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1); // Calculate the next day

      const users = await User.find({
        subscriptionRenewalDate: {
          $gte: currentDate,
          $lt: nextDay,
        },
      });

      for (const user of users) {
        user.subscriptionRenewalDate = next30Days;
        user.audioCount=0
        user.wordsCount=0
        user.imagesCount=0
        //TODO: Set other users attributes on the basis of current user plan
        await user.save();
      }

      console.log(`Updated ${users.length} user records.`);
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
}
