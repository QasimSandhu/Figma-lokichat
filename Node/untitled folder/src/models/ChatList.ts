import mongoose from "mongoose";
import IChatList from "../interfaces/IChatList";

const chatListSchema = new mongoose.Schema<IChatList>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const ChatList = mongoose.model<IChatList>("ChatList", chatListSchema);

export default ChatList;
