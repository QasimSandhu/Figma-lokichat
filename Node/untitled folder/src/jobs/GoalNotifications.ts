import cron from "node-cron";
import moment from "moment";
import Goal from "../models/Goal";
import User from "../models/User";
import Notifications from "../models/Notifications";
import {
  GOAL_REMINDER,
  GOAL_STATUS,
  REMINDER_FREQUENCY,
} from "../lib/constants/goal";
import express from "express";
import { Socket } from "../classes/SocketIO";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { size } from "lodash";

const socket = new Socket();

const router = express.Router();

const {
  oneHour,
  twoHours,
  fourHours,
  sixHours,
  oneDay,
  oneWeek,
  twoWeek,
  oneMonth,
} = REMINDER_FREQUENCY;

const oneHourBeforeDayEnd = "0 23 * * *"; // one hour before
const twoHoursBeforeDayEnd = "0 22 * * *"; // two hours before
const fourHoursBeforeDayEnd = "0 20 * * *"; // four hours before
const sixHoursBeforeDayEnd = "0 18 * * *"; // six hours before
const oneDayBefore = "0 0 * * *"; // At 12:00 AM of Every Night

const everydayAtFiveFiftyFivePM = "55 17 * * *"; // At 5:55 PM every day

// Schedule the cron job
cron.schedule(oneHourBeforeDayEnd, async () => {
  try {
    const currentTime = moment();
    const tomorrow = moment().add(1, "days").startOf("day");

    const goals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: oneHour,
      dueOnDate: {
        $gte: currentTime.startOf("day").toDate(),
        $lt: tomorrow.toDate(),
      },
    });
    if(size(goals) > 0) {
      await sendGoalExpirationReminder(goals);
    }
  } catch (error) {
    console.error("Goal Notifications One Hour Before Error:", error);
  }
});

cron.schedule(twoHoursBeforeDayEnd, async () => {
  try {
    const currentTime = moment();
    const tomorrow = moment().add(1, "days").startOf("day");

    const goals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: twoHours,
      dueOnDate: {
        $gte: currentTime.startOf("day").toDate(),
        $lt: tomorrow.toDate(),
      },
    });
    if(size(goals) > 0) {
      await sendGoalExpirationReminder(goals);
    }
  } catch (error) {
    console.error("Goal Notifications Two Hours Before Error:", error);
  }
});

cron.schedule(fourHoursBeforeDayEnd, async () => {
  try {
    const currentTime = moment();
    const tomorrow = moment().add(1, "days").startOf("day");

    const goals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: fourHours,
      dueOnDate: {
        $gte: currentTime.startOf("day").toDate(),
        $lt: tomorrow.toDate(),
      },
    });
    if(size(goals) > 0) {
      await sendGoalExpirationReminder(goals);
    }
  } catch (error) {
    console.error("Goal Notifications Four Hours Before Error:", error);
  }
});

cron.schedule(sixHoursBeforeDayEnd, async () => {
  try {
    const currentTime = moment();
    const tomorrow = moment().add(1, "days").startOf("day");

    const goals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: sixHours,
      dueOnDate: {
        $gte: currentTime.startOf("day").toDate(),
        $lt: tomorrow.toDate(),
      },
    });
    if(size(goals) > 0) {
      await sendGoalExpirationReminder(goals);
    }
  } catch (error) {
    console.error("Goal Notifications Six Hours Before Error:", error);
  }
});

// This is some how special, here some updations are requried
cron.schedule(oneDayBefore, async () => {
  try {
    const currentTime = moment();
    const oneDayBefore = moment().add(2, "days").startOf("day");
    const oneWeekBefore = moment().add(1, "weeks").startOf("day");
    const twoWeekBefore = moment().add(2, "weeks").startOf("day");
    const oneMonthBefore = moment().add(1, 'months').startOf("day");

    // start time values
    const oneWeekStartTime = moment(oneWeekBefore).subtract(1, "days").startOf("day");
    const twoWeekStartTime = moment(twoWeekBefore).subtract(1, "days").startOf("day");
    const oneMonthStartTime = moment(oneMonthBefore).subtract(1, "days").startOf("day");

    const oneDayBeforeGoals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: oneDay,
      dueOnDate: {
        $gte: currentTime.startOf("day").toDate(),
        $lt: oneDayBefore.toDate(),
      },
    });
    if(size(oneDayBeforeGoals) > 0) {
      await sendGoalExpirationReminder(oneDayBeforeGoals);
    }


    // One Week Before Goals
    const oneWeekBeforeGoals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: oneWeek,
      dueOnDate: {
        $gte: oneWeekStartTime,
        $lt: oneWeekBefore.toDate(),
      },
    });
    if(size(oneWeekBeforeGoals) > 0) {
      await sendGoalExpirationReminder(oneWeekBeforeGoals);
    }
    
    // Two Weeks Before Goals
    const twoWeekBeforeGoals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: twoWeek,
      dueOnDate: {
        $gte: twoWeekStartTime,
        $lt: twoWeekBefore.toDate(),
      },
    });
    if(size(twoWeekBeforeGoals) > 0) {
      await sendGoalExpirationReminder(twoWeekBeforeGoals);
    }

    // One Month Before Goals
    const oneMonthBeforeGoals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: oneMonth,
      dueOnDate: {
        $gte: oneMonthStartTime,
        $lt: oneMonthBefore.toDate(),
      },
    });
    if(size(oneMonthBeforeGoals) > 0) {
      await sendGoalExpirationReminder(oneMonthBeforeGoals);
    }


  } catch (error) {
    console.error("Goal Notifications Day Hours Before Error:", error);
  }
});

// Schedule the cron job
router.get("/hour", async (req: any, res: any) => {

  try {
    const currentTime = moment();
    const tomorrow = moment().add(2, "days").startOf("day");
    const oneWeekBefore = moment().add(1, "weeks").startOf("day");
    const startTime = moment(tomorrow).subtract(1, "days").startOf("day");

    console.log('currentTime', startTime.startOf("day").toDate());
    console.log('tomorrow', oneWeekBefore.toDate());

    const goals = await Goal.find({
      status: GOAL_STATUS.INPROGRESS,
      notificationsReminder: true,
      reminderFrequency: twoHours,
      dueOnDate: {
        $gte: currentTime,
        $lte: tomorrow.toDate(),
      },
    });
    if(size(goals) > 0) {
      await sendGoalExpirationReminder(goals);
    }
    res.status(200).json({success: true, data: goals});
  } catch (error) {
    console.error("Goal Notifications Two Hours Before Error:", error);
    res.status(400).json({success: false});
  }
});

const sendGoalExpirationReminder = async (goals: any[]) => {
  goals.forEach(async (goal) => {

    const user = await User.findById(goal.user).select("userName email isDeleted");
    const notification = {
      title: `${GOAL_REMINDER}`,
      name: `${SOCKET_EVENT_TYPES.GOAL_NOTIFICATION}_${goal.user}`,
      message: `Hi ${user.userName}, just a heads up! Your goal deadline for ${goal.name} is nearing expiration, with only ${goal.reminderFrequency} left. Let's discuss key points to ensure success.`,
      from: goal.user,
      receivers: [goal.user],
      referenceId: goal._id
    };
   

    const notifications = new Notifications(notification);
    await notifications.save();

    socket.emit(`${SOCKET_EVENT_TYPES.GOAL_NOTIFICATION}_${goal.user}`, {
      isNotification:true,
      userIds:[goal?.user]
  });
  });
};
export default router;

process.stdin.resume();
