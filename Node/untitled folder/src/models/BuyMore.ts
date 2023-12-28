import mongoose from "mongoose";

const BuyMoreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    limit:{
        type: Number,
        required: true,
    }
  },
  { timestamps: true }
);

const BuyMore = mongoose.model("BuyMore", BuyMoreSchema);

export default BuyMore;
