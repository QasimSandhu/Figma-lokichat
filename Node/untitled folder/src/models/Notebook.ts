import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatGpt",
      required: false,
      default: null,
    },
    debate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debate",
      required: false,
      default: null,
    },
    messageId: {
      type: String,
      required: false,
    },
    contenType: {
      type: String,
      enum:["file","message"],
      required: true,
      default:"message"
    },
    response: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notebook = mongoose.model("Notebook", notebookSchema);

export default Notebook;
