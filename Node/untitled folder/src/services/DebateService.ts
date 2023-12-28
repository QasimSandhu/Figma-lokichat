import { isEmpty, size } from "lodash";
import Debate from "../models/Debate";
import LLama2Bot from "../classes/LLama2Model";
import { SEARCH_FILTER } from "../lib/constants/filterTypes";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import Notifications from "../models/Notifications";
import { Socket } from "../classes/SocketIO";
import { getPlainTextFromHTML } from "../lib/helpers/textFormatting";
import { DEBATE_INVITATION, DEBATE_LEAVE, MESSAGE_TYPES } from "../lib/constants/debate";
import mongoose from "mongoose";
import { ROUTES } from "../lib/constants/routes";
import Subscription from "../models/Subscription";
import User  from "../models/User";
import { updateUserWordsCounter, verifyRemainingWords } from "../lib/helpers/subscrptions";

const socket = new Socket();

class DebateService {
  async store(req) {
    const { body, userId } = req;
    const { title, invitedUsers } = body;

    if (size(invitedUsers) === 0)
      throw new Error("No user is invited, so, you cant start debate");

    const userIdSet = new Set();

    for (const userId of invitedUsers) {
      if (userIdSet.has(userId)) {
        // Duplicate user ID found, throw an exception
        throw new Error(`Duplicate user ID found: ${userId}`);
      }
      userIdSet.add(userId);
    }

    const invitedUsersArray = invitedUsers.map((user) => ({ user }));
    const debate = new Debate({
      title,
      user: userId,
      invitedUsers: invitedUsersArray,
    });
    await debate.save();

    await debate.populate({
      path: "user invitedUsers.user messages.sender",
      select: "email userName profileUrl",
    });

    const notification = {
      title: `${DEBATE_INVITATION}`,
      name: SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
      message: `You are invited in ${debate.title} debate.`,
      item: debate._id,
      from: userId,
      receivers: invitedUsers,
      pagePath: ROUTES.DEBATE,
      pageId: debate._id,
      profileUrl: debate.user?.profileUrl ?? null
    };

    for (let i = 0; i < size(invitedUsers); i++) {
      socket.emit(
        `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${invitedUsers[i]}`,
        { message: debate.messages[debate.messages.length - 1] }
      );
    }

    const notifications = new Notifications(notification);
    await notifications.save();

    socket.emit(SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
      isNotification:true,
      userIds: [...invitedUsers]
    });

    return debate;
  }

  async index(req) {
    const { query, userId } = req;
    const { filter, search, page, resPerPage } = query;

    const searchFilter = search
      ? { title: { $regex: new RegExp(search, "i") } }
      : {};
    let dateFilter: any = {};

    if (filter === SEARCH_FILTER.TODAY) {
      dateFilter = {
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      };
    } else if (filter === SEARCH_FILTER.LAST_WEEK) {
      dateFilter = {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      };
    } else if (filter === SEARCH_FILTER.PREVIOUS_MONTH) {
      dateFilter = {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      };
    } else if (filter === SEARCH_FILTER.OLDER) {
      dateFilter = {
        createdAt: {
          $lt: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      };
    }
    const [debates, totalDebates] = await Promise.all([
      Debate.aggregate([
        {
          $match: {
            $or: [
              { user: new mongoose.Types.ObjectId(userId) },
              { 'invitedUsers.user': { $in: [new mongoose.Types.ObjectId(userId)] } },
              { 'leavedDebateUsers.user': { $in: [new mongoose.Types.ObjectId(userId)] } },
              { 'removedDebateUsers.user': { $in: [new mongoose.Types.ObjectId(userId)] } }
            ],
            ...searchFilter,
            ...dateFilter,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            createdAt: 1,
            updatedAt: 1,
            unreadMessages: {
              $size: {
                $filter: {
                  input: "$messages",
                  as: "message",
                  cond: {
                    $not: {
                      $in: [new mongoose.Types.ObjectId(userId), { $ifNull: ["$$message.readBy", []] }],
                    },
                  },
                },
              },
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: resPerPage * (page - 1) },
        { $limit: Number(resPerPage) },
      ]),

      Debate.countDocuments({
        $or: [
          { user: userId },
          { 'invitedUsers.user': { $in: [userId] } },
          { 'invitedUsers.user': { $in: [new mongoose.Types.ObjectId(userId)] } },
          { 'leavedDebateUsers.user': { $in: [new mongoose.Types.ObjectId(userId)] } },
          { 'removedDebateUsers.user': { $in: [new mongoose.Types.ObjectId(userId)] } }
        ],
        ...searchFilter,
        ...dateFilter,
      }),
    ]);

    const availableRecords = await Debate.countDocuments({ user: userId });

    return {
      debates,
      currentPage: Number(page),
      pages: Math.ceil(totalDebates / resPerPage),
      totalDebates: Number(totalDebates),
      perPage: Number(resPerPage),
      isAvailableRecords: availableRecords > 0 ? true : false
    };
  }

  async show(req) {
    const { userId, params } = req;
    const { debateId } = params;

    const debate = await Debate.findOne({
      _id: debateId,
      $or: [
        { user: userId },
        { 'invitedUsers.user': userId },
        { 'leavedDebateUsers.user': userId },
        { 'removedDebateUsers.user': userId }
      ]
    });

    if (!debate) throw new Error("No debate found with this id.");

    let createdAt;
    if (debate.leavedDebateUsers.some(user => user.user == userId)) {
      const userObj = debate.leavedDebateUsers.find(user=>user.user == userId);
      createdAt = userObj.createdAt;
    } else if (debate.removedDebateUsers.some(user => user.user === userId)) {
      const userObj = debate.removedDebateUsers.find(user=>user.user == userId);
      createdAt = userObj.createdAt;
    }

    if(createdAt) {
      debate.messages = debate.messages.filter(msg => msg.createdAt < createdAt);
    }

    await debate
    .populate({
      path: "user invitedUsers.user messages.sender",
      select: "email userName profileUrl",
    });
    if(size(debate.invitedUsers) > 1) {
      debate.invitedUsers = debate.invitedUsers?.sort((a, b) => b?.createdAt - a?.createdAt);
    }
    return debate;
  }

  async update(req) {
    const { userId, body } = req;
    const { message, debateId, mentionedUsers, isBotMentioned, responseTo } = body;
    const debate = await Debate.findById(debateId);
    if (!debate) throw new Error("no debate found with this Id");
    const updatedMessage = {
      sender: userId,
      message: message,
      mentionedUsers: mentionedUsers || [],
      isBotMentioned: isBotMentioned || false,
      responseTo: responseTo || null,
      readBy: [userId]
    };

    debate.messages.push(updatedMessage);
    if (isBotMentioned) {
      const debateMsg = getPlainTextFromHTML(message);
      const user = await User.findById(userId);
      const subscriptions = await Subscription.find();

      await verifyRemainingWords(user, subscriptions);
      const botResponse = await LLama2Bot.fetchAnswer([], debateMsg);
      await updateUserWordsCounter(user, botResponse, subscriptions);

      const lastMessageIdx = size(debate.messages);
      const botMessage = {
        sender: userId,
        message: botResponse,
        mentionedUsers: mentionedUsers || [],
        isBotResponse: true,
        responseTo: debate.messages[lastMessageIdx - 1]?._id,
        readBy: [userId],
      };
      debate.messages.push(botMessage);
    }
    await debate.save();

    const invitedUserIds = debate.invitedUsers.map(el => el.user);

    let notificationReceivers = [...invitedUserIds, debate.user];
    
    await debate.populate({
      path: "messages.sender",
      select: "email userName profileUrl",
    });

    pushNewMessageNotification(debate, notificationReceivers, MESSAGE_TYPES.DEBATE_NOTIFICATION);
    return debate;
  }

  async updateMessages(req) {
    try {
      const { userId, body } = req;
      const { debateId, messageId, message, mentionedUsers, isBotMentioned } = body;
  
        if (!debateId) throw new Error("debateId is required");
  
        const debate = await Debate.findById(debateId);
        if (!debate) throw new Error("No debate found with this id.");
        let updatedDebateMsg;
        let newDebateMsg;
        const updatedMessage: any = {
          message: message,
          mentionedUsers: mentionedUsers || [],
          isBotMentioned: isBotMentioned,
        };
  
        const invitedUserIds = debate.invitedUsers.map(el => el.user);
        let notificationReceivers = [...invitedUserIds, debate.user];

        if (isBotMentioned) {
          const user = await User.findById(userId);
          const subscriptions = await Subscription.find();
          await verifyRemainingWords(user, subscriptions);
          const botResponse = await LLama2Bot.fetchAnswer([], message);
          await updateUserWordsCounter(user, botResponse, subscriptions);
  
          updatedMessage.response = botResponse;
          updatedMessage.isBotResponse = true;
  
          const indexToUpdate = debate.messages.findIndex((msg) => msg.responseTo == messageId);
          if(indexToUpdate !== -1) {
            debate.messages[indexToUpdate].message = updatedMessage.response;
            debate.messages[indexToUpdate].mentionedUsers = updatedMessage.mentionedUsers;
            debate.messages[indexToUpdate].isBotMentioned = true;
            const updatedDebate =  await Debate.findOneAndUpdate(
              { _id: debateId, 'messages.responseTo': messageId },
              { $set: { 
                "messages.$.message": updatedMessage.response,
                "messages.$.mentionedUsers":  updatedMessage.mentionedUsers,
                "messages.$.isBotMentioned": true,
              } },
              { new: true }
            ).select('messages');
            await updatedDebate.populate({
              path: "messages.sender",
              select: "email userName profileUrl",
            });
            updatedDebateMsg = updatedDebate.messages[indexToUpdate];
          } else {
            const updatedDebate = await Debate.findOneAndUpdate(
              { _id: debateId },
              {
                $push: {
                  messages: {
                    responseTo: messageId,
                    message: updatedMessage.response,
                    mentionedUsers: updatedMessage.mentionedUsers,
                    isBotResponse: true,
                    sender: userId,
                  }
                }
              }, { new: true }).select('messages');

              await updatedDebate.populate({
                path: "messages.sender",
                select: "email userName profileUrl",
              });
            newDebateMsg = updatedDebate.messages[updatedDebate.messages.length - 1];
          }
        }
        const indexToUpdate = debate.messages.findIndex((msg) => msg._id == messageId);
        const updatedDebateObj = await Debate.findOneAndUpdate({
          _id: debateId, messages: {$elemMatch: {_id: messageId}}
        }, {
          $set: {
            "messages.$.message": updatedMessage.message,
            "messages.$.mentionedUsers": updatedMessage.mentionedUsers,
            "messages.$.isBotMentioned": updatedMessage.isBotMentioned,
          }
        }, { new: true }).select('messages');

        await updatedDebateObj.populate({
          path: "messages.sender",
          select: "email userName profileUrl",
        });

        if (indexToUpdate !== -1) {
          // pushUpdateMessageNotification(debate._id, updatedDebateObj.messages[indexToUpdate], notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
          pushUpdateMsgIntoBotMsgNotification(debate._id, updatedDebateObj.messages[indexToUpdate], notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION)
        }
        if (!isEmpty(updatedDebateMsg)) {
          // pushUpdateMessageNotification(debate._id, updatedDebateMsg, notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
          pushUpdateMsgIntoBotMsgNotification(debate._id, updatedDebateMsg, notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION)

        }
        if (!isEmpty(newDebateMsg)) {
          pushUpdateMsgIntoBotMsgNotification(debate._id, newDebateMsg, notificationReceivers, MESSAGE_TYPES.CONVERT_MSG_TO_BOT_MSG_RESPONSE);
        }  
      return updatedDebateObj;
    } catch(err) {
      console.log('err', err);
      // await session.abortTransaction();
      throw new Error(err?.message ?? "Error while saving debate")
    }
  }

  async updateBotMessages(req) {
    const { body, userId } = req;
    const { debateId, messageId, responseTo } = body;

    if (!debateId) throw new Error("debateId is required");

    const debate = await Debate.findById(debateId);
    if (!debate) throw new Error("No debate found with this id.");
    const debateMessageObj = debate.messages.find(
      (msg: any) => msg._id == responseTo
    );
    if (!debateMessageObj)
      throw new Error("No prompt found with respective bot response");

    const debateMsg = getPlainTextFromHTML(debateMessageObj.message);

    const user = await User.findById(userId);
    const subscriptions = await Subscription.find();
    await verifyRemainingWords(user, subscriptions);
    const botResponse = await LLama2Bot.fetchAnswer([], debateMsg);
    await updateUserWordsCounter(user, botResponse, subscriptions);

    const indexToUpdate = debate.messages.findIndex((msg) => msg._id == messageId);

    if(indexToUpdate !== -1) {
      debate.messages[indexToUpdate].message = botResponse;
      await debate.save();
    }

    const invitedUserIds = debate.invitedUsers.map(el => el.user);
    let notificationReceivers = [...invitedUserIds, debate.user];

    await debate.populate({
      path: "messages.sender",
      select: "email userName profileUrl",
    });

    // pushUpdateMessageNotification(debateId, debate.messages[indexToUpdate], notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION);
    pushUpdateMsgIntoBotMsgNotification(debateId, debate.messages[indexToUpdate], notificationReceivers, MESSAGE_TYPES.UPDATE_DEBATE_MESSAGE_NOTIFICATION)
    return debate;
  }

  async updateInvitedUsers(req) {
    const { userId, body } = req;
    const { debateId, invitedUser } = body;

    if (size(invitedUser) === 0)
      throw new Error("no invited user is included");
    const debate = await Debate.findById(debateId).populate({
      path: "user",
      select: "email userName profileUrl",
    });
    if (!debate) throw new Error("No debate found with this id.");

    if (debate.user?._id != userId)
      throw new Error("Only debate admin can invite more users");
  
    // Remove the invited user from leaveDebateUserIds if present
    const isDuplicateUser = debate.invitedUsers.findIndex((el: any) => el.user == invitedUser);
    if(isDuplicateUser !== -1) {
      throw new Error(`Duplicate user ID found: ${invitedUser}`);
    }
    const leaveDebateIndex = debate.leavedDebateUsers.findIndex((el: any) => el.user == invitedUser);
    const removedDebateIndex = debate.removedDebateUsers.findIndex((el: any) => el.user == invitedUser);
    if (leaveDebateIndex !== -1) {
      debate.leavedDebateUsers.splice(leaveDebateIndex, 1);
    }
    if (removedDebateIndex !== -1) {
      debate.removedDebateUsers.splice(leaveDebateIndex, 1);
    }

    debate.invitedUsers.push({ user: invitedUser });

    const invitedUserIds = debate.invitedUsers.map(el => el.user);
    const notificationReceivers = [...invitedUserIds];
    const notification = {
      title: `${DEBATE_INVITATION}`,
      name: SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
      message: `You are invited in ${debate.title} debate.`,
      item: debate._id,
      from: userId,
      receivers: [invitedUser],
      pagePath: ROUTES.DEBATE,
      pageId: debate._id,
      profileUrl: debate.user?.profileUrl ?? null
    };

    socket.emit(
      `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${invitedUser}`,
      { message: debate.messages[debate.messages.length - 1] }
    );

    const notifications = new Notifications(notification);
    await notifications.save();

    socket.emit(SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
      isNotification: true,
      userIds: [invitedUser]
    });

    await debate.save();
    await debate.populate({
      path: "invitedUsers.user",
      select: "email userName profileUrl",
    });

    if(size(debate.invitedUsers) > 1) {
      debate.invitedUsers = debate.invitedUsers?.sort((a, b) => b?.createdAt - a?.createdAt);
    }

    const populatedInvitedUsers = debate.invitedUsers.map(el => el.user);

    updateDebateInvitedUserFromDebate(debateId, populatedInvitedUsers, notificationReceivers);
    return debate;
  }

  async removeUserFromDebate(req) {
    const { userId, body } = req;
    const { debateId, userToRemove } = body;

    const debate = await Debate.findById(debateId).populate({
      path: "user",
      select: "email userName profileUrl",
    });
    if (!debate) throw new Error("No debate found with this id.");

    if (debate.user._id != userId)
      throw new Error("Only debate admin can remove users");

    // Remove the invited user from leaveDebateUserIds if present
    const removedUserIdx = debate.invitedUsers.findIndex((usr: any) => usr.user == userToRemove);
    if (removedUserIdx !== -1) {
      debate.invitedUsers.splice(removedUserIdx, 1);
    }

    const invitedUserIds = debate.invitedUsers.map(el => el.user);
    const notificationReceivers = [...invitedUserIds, userToRemove];
    debate.removedDebateUsers.push({ user: userToRemove });
    const notification = {
      title: `${DEBATE_INVITATION}`,
      name: SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
      message: `You are removed from ${debate.title} debate.`,
      item: debate._id,
      from: userId,
      receivers: [userToRemove],
      pagePath: ROUTES.DEBATE,
      pageId: debate._id,
      profileUrl: debate.user.profileUrl ?? null
    };

    socket.emit(
      `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${userToRemove}`,
      { message: debate.messages[debate.messages.length - 1] }
    );

    const notifications = new Notifications(notification);
    await notifications.save();

    socket.emit(SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,{
      isNotification: true,
      userIds: [userToRemove]
    });

    await debate.save();
    await debate.populate({
      path: "invitedUsers.user",
      select: "email userName profileUrl",
    });
    
    if(size(debate.invitedUsers) > 1) {
      debate.invitedUsers = debate.invitedUsers?.sort((a, b) => b?.createdAt - a?.createdAt);
    }
    
    const updatedInvitedUsers = debate.invitedUsers.map(el => el.user);
    updateDebateInvitedUserFromDebate(debateId, updatedInvitedUsers, notificationReceivers);
    return debate;
  }

  async leaveDebate(req) {
    const { body, userId } = req;
    const { debateId } = body;

    const debate = await Debate.findById(debateId).populate({
      path: 'invitedUsers.user',
      select: 'email userName profileUrl'
    });
    if(!debate) throw new Error('No debate found with this id');
    if(userId == debate.user) throw new Error('You are debate admin, you cant leave this debate');

    const leavedUserIdx = debate.invitedUsers.findIndex(el => el.user._id == userId);

    const userWhoLeaveDebate = debate.invitedUsers.find((usr: any) => usr?.user?._id == userId);
    if(leavedUserIdx !== -1) {
      debate.invitedUsers.splice(leavedUserIdx, 1);
    }
    const debateInvitedUsers = debate.invitedUsers.map(el => el.user?._id);
    const notificationReceivers = [...debateInvitedUsers, debate.user];

    debate.leavedDebateUsers.push({user: userId});

    const notificationUsers = [...debateInvitedUsers, debate.user];
    await debate.save();

    await debate.populate({
      path: "user invitedUsers.user messages.sender",
      select: "email userName profileUrl",
    });

    if(size(debate.invitedUsers) > 1) {
      debate.invitedUsers = debate.invitedUsers?.sort((a, b) => b?.createdAt - a?.createdAt);
    }

    const populatedInvitedUsers = debate.invitedUsers.map(el => el.user);

    updateDebateInvitedUserFromDebate(debateId, populatedInvitedUsers, notificationReceivers);

    for (let i = 0; i < size(notificationUsers); i++) {
      socket.emit(
        `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationUsers[i]}`,
        { message: debate.messages[debate.messages.length - 1] }
      );
    }

    const notification = {
      title: `${DEBATE_LEAVE}`,
      name: SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
      message: `${userWhoLeaveDebate?.user?.userName} leave ${debate.title} debate.`,
      from: userId,
      item: debate._id,
      receivers: notificationUsers,
      pagePath: ROUTES.DEBATE,
      pageId: debate._id,
      profileUrl: userWhoLeaveDebate?.user?.profileUrl ?? null
    };

    const notifications = new Notifications(notification);
    await notifications.save();
    socket.emit(SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION, {
      isNotification: true,
      userIds: notificationUsers
    })

    return debate;
  }

  async markAsReadDebate(req) {
    const { body, userId } = req;
    const { debateId } = body;

    const debate = await Debate.findById(debateId);
    if(!debate) throw new Error('No debate found with this id');

    debate.messages?.forEach((message) => {
      // Check if the user ID is not already in the readBy array
      if (!message.readBy.includes(userId)) {
        // Add the user ID to the readBy array
        message.readBy.push(userId);
      }
    });

    await debate.save();
    return debate;
  }

  async deleteMessage(req) {
    const { body, userId} = req;
    const { messageId, debateId } = body;

    const result = await Debate.updateOne(
      { _id: debateId, user: userId },
      {
        $pull: {
          messages: {
            $or: [
              { messageId: messageId },
              { responseTo: messageId }
            ]
          }
        }
      }
    );

    const chat = await Debate.findById(debateId);
    if(size(chat.messages) === 0) {
      await Debate.findByIdAndDelete(debateId);
    }
    return result;
  }

  async updateMessage(req) {
    const { body, userId } = req;
    const { messageId, chatId, message, response } = body;

    await Debate.findOneAndUpdate(
      { _id: chatId, "messages.messageId": messageId },
      { $set: { "messages.$.content": message } },
      { new: true }
    );

    await Debate.findOneAndUpdate(
      { _id: chatId, "messages.responseTo": messageId },
      { $set: { "messages.$.content": response } },
      { new: true }
    );
    return "Chat reverted successfully";
  }
}

const pushNewMessageNotification=(debate: any, notificationReceivers: any[], type)=> {
  for (let i = 0; i < size(notificationReceivers); i++) {
    const secondLastMsg = debate.messages[debate.messages.length - 2];
    const lastMsg = debate.messages[debate.messages.length - 1];
    socket.emit(
      `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`,
      { message: secondLastMsg, debateId: debate._id, type }
    );
    socket.emit(
      `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`,
      { message: lastMsg, debateId: debate._id, type }
    );
  }
}

const pushUpdateMsgIntoBotMsgNotification = (debateId, message: any, notificationReceivers: any[], type: string) => {
  for (let i = 0; i < size(notificationReceivers); i++) {
    socket.emit(
      `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`,
      { message: message, debateId: debateId, type }
    );
  }
}

const updateDebateInvitedUserFromDebate = (debateId, invitedUsers: any, notificationReceivers: any[]) => {
  for (let i = 0; i < size(notificationReceivers); i++) {
    socket.emit(
      `${SOCKET_EVENT_TYPES.UPDATE_DEBATE_INVITED_USERS}_${notificationReceivers[i]}`,
      { invitedUsers: invitedUsers, debateId: debateId }
    );
  }
}


export default new DebateService();
