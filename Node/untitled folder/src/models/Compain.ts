import mongoose, { Schema } from "mongoose";

const CompainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description:{
        type: String,
    },
    referralCode:{
      type: String,
  },

    creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Compains = mongoose.model("Compain", CompainSchema);

export default Compains;
