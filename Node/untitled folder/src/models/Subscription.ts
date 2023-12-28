import mongoose from "mongoose";
import { PLAN_TYPE } from "../lib/constants/plans";

const subscriptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    save: {
      type: Number,
      required: true,
    },
    plans: [
      {
        title: {
          type: String,
          required: true,
        },
        stripeId: {
          type: String,
          required: true,
        },
        popular: {
          type: Boolean,
          default: true,
        },
        currentPlan: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        priceDetails: {
          type: String,
          required: true,
        },
        audioAllowed: {
          type: Number,
          required: true,
        },
        imagesAllowed: {
          type: Number,
          required: true,
        },
        wordsAllowed: {
          type: Number,
          required: true,
        },
        details: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
