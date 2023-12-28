import mongoose, { Schema } from "mongoose";
import IGoal from "../interfaces/IGoal";
import { GOAL_STATUS } from "../lib/constants/goal";
import { REMINDER_FREQUENCY } from "../lib/constants/goal";

const { oneHour, twoHours, fourHours, sixHours, oneDay, oneWeek, twoWeek, oneMonth, nullValue } = REMINDER_FREQUENCY;

const goalSchema = new Schema<IGoal>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dueOnDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [GOAL_STATUS.INPROGRESS, GOAL_STATUS.COMPLETED],
      required: false,
    },
    notificationsReminder: {
      type: Boolean,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    keyPoint1: {
      type: String,
      required: false,
    },
    keyPoint2: {
      type: String,
      required: false,
    },
    keyPoint3: {
      type: String,
      required: false,
    },
    reminderFrequency: {
      type: String,
      enum: [oneHour, twoHours, fourHours, sixHours, oneDay, oneWeek, twoWeek, oneMonth, null],
      required: false,
      default: nullValue
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;
