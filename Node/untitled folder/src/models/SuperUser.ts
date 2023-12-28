import mongoose from "mongoose";
import { Schema } from "mongoose";
import { SUPER_USER_STATUS } from "../lib/constants/user";
import ISuperUser from "../interfaces/ISuperUser";

const superUserSchema = new Schema<ISuperUser>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    status: {
      type: String,
      enum: [
        SUPER_USER_STATUS.PENDING,
        SUPER_USER_STATUS.APPROVED,
        SUPER_USER_STATUS.APPROVED,
      ],
      required: true,
      default: SUPER_USER_STATUS.PENDING,
    },
    statusUpdatedDate: {
      type: Date,
      default: Date.now(),
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: false,
    },
    stripeConnectAccountId:{
      type:String
    },
    socialInfo: [
      {
        userName: {
          type: String,
          required: true,
        },
        platform: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SuperUser = mongoose.model<ISuperUser>("SuperUser", superUserSchema);

export default SuperUser;
