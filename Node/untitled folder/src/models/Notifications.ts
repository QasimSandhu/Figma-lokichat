import mongoose, { Schema } from "mongoose";
import INotifications from "../interfaces/INotifications";

let NotificationsSchema = new Schema<INotifications>(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profileUrl: {
      type: String,
      required: false
    },
    referenceId: {
      type: String,
      required: false
    },
    item:{
      type: Schema.Types.ObjectId,
    },
    receivers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    pagePath: {
      type: String,
      required: false
    },
    pageId: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);
const Notifications = mongoose.model<INotifications>("notifications", NotificationsSchema);

export default Notifications;
