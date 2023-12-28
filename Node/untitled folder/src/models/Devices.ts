import mongoose, { Schema } from "mongoose";
import ILoggedInDevice from "../interfaces/IDevice";

const devicesSchema = new Schema<ILoggedInDevice>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    browserName: {
      type: String,
      required: false,
      default: null
    },
    os: {
      type: String,
      required: true,
    },
    browserVersion:{
      type: String,
      required: false,
      default: null
    },
    mobileId: {
      type: String,
      required: false,
      default: null
    },
    mobileName: {
      type: String,
      required: false,
      default: null
    },
    date: {
      type: Date,
      required: true,
      default: null
    },
  },
  { timestamps: true }
);

const Devices = mongoose.model<ILoggedInDevice>("Devices", devicesSchema);

export default Devices;
