import mongoose from "mongoose";

const connectTransferSchema = new mongoose.Schema(
  {
    superUser: { //who referred link
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referalUser: { //who used the link and pay
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transferId: {
      type: String,
      required: true,
    },
    transferReversalId:{
      type:String,
      require:false
    },
    type: {
      type: String,
      enum:['SEND','REVERSE'],
      default:'SEND',
      required: true,
    }
  },
  { timestamps: true }
);

const ConnectTransfer = mongoose.model("ConnectTransfer", connectTransferSchema);

export default ConnectTransfer;
