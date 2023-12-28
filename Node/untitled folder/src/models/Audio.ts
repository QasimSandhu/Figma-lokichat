import mongoose from "mongoose";
import { CHAT_LANGUAGES } from "../lib/constants/chats";
import { USER_GENDER } from "../lib/constants/user";

const audioSchema = new mongoose.Schema(
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
      default: null
    },
    debate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debate",
      required: false,
      default: null
    },
    text: {
      type: String,
      required: true,
    },
    audioLabel: {
      type: String,
      default: null,
      required: false,
    },
    audioColor: {
      type: String,
      default: null,
      required: false,
    },
    voiceIdentifier: {
      type: String,
      required: true,
    },
    voiceMode: {
      type: String,
      default: 'default',
    },
    language: {
      type: String,
      default: CHAT_LANGUAGES.EN,
      required: true,
    },
    speakerName: {
      type: String,
      required: false,
    },
    editedText: {
      type: String,
      required: false,
    },
    audioFilePath: {
      type: String, // Path to the generated audio file
      required: true,
    },
    sharedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    sharedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Audio = mongoose.model("Audio", audioSchema);

export default Audio;
