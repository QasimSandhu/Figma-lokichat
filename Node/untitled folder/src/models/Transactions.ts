import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralSuperUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentId: {
      type: String,
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status:{
      type:String,
      enum:['Pending','Available'],
      default:'Pending'
    },
    deliveryStatus:{
      type:String,
      enum:['Pending','Completed'],
      default:'Pending'
    },
    balanceTransaction:{
      type:String,
      required:false
    },
    available_on:{
      type:Number,
      required:false
    },
    refferalConnectAccountTransferid:{
      type:String,
      required:false
    },
    isRefferedAmount:{
      type:Boolean,
      default:false
    },
    campaignId: { type: Schema.Types.ObjectId, ref: "Compain", required:false },
    deleiveredAt: { type: Date },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
