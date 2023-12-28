import mongoose from "mongoose";
import { CHAT_ROLES, CHAT_TYPE } from "../lib/constants/chats";

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: false,
  },
  sender: {
    type: String,
    enum: [CHAT_ROLES.USER, CHAT_ROLES.ASSISTANT, CHAT_ROLES.CHATBOT],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  addedInNotebook: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responseTo: {
    type: String,
    default: null,
  },
  type:{
    type:String,
    required:false
  }
});

const chatGptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatList",
      default: null
    },
    messages: {
      type: [messageSchema],
      default: [],
      required: false
    },
    type: { type: String, enum: [CHAT_TYPE.CHAT, CHAT_TYPE.SUMMARY, CHAT_TYPE.EXAM], default: CHAT_TYPE.CHAT },
    chatModel: { type: String, required: false }, 
    feedback: {
      rating: {type: Number, required: false},
      comment: {type: String, required: false }
    },
  },
  { timestamps: true }
);

const ChatGpt = mongoose.model("ChatGpt", chatGptSchema);

export default ChatGpt;
