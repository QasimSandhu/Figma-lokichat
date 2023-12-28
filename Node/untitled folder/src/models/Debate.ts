import mongoose, { Schema } from "mongoose";
import IDebate from "src/interfaces/IDebate";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  addedInNotebook: {
    type: Boolean,
    default: false,
  },
  mentionedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
    required: false,
  }],
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
    required: false,
  }],
  isBotMentioned: {
    type: Boolean,
    default: false,
  },
  isBotResponse: {
    type: Boolean,
    default: false,
  },
  responseTo: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const invitedUsersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const leaveDebateUsersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const removedUsersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const debateSchema = new Schema<IDebate>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // invitedUsers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // }],
    // leavedDebateUsers: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   default: null,
    // }],
    // removedDebateUsers: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   default: null,
    // }],
    invitedUsers: [invitedUsersSchema],
    leavedDebateUsers: [leaveDebateUsersSchema],
    removedDebateUsers: [removedUsersSchema],
    messages: {
      type: [messageSchema],
      default: [],
      required: false
    }
  },
  { timestamps: true }
);

const Debate = mongoose.model<IDebate>("Debate", debateSchema);

export default Debate;
