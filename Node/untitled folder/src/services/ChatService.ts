import ChatGPT from "../models/Chat";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import { v4 as uuid } from "uuid";
import OpenAIBot from "../classes/ChatBot";

import LLama2Bot from "../classes/LLama2Model";
import { getPlainTextFromHTML } from "../lib/helpers/textFormatting";
import User from "../models/User";
import Subscription from "../models/Subscription";
import mongoose from "mongoose";
import { CHAT_MODEL, CHAT_ROLES, CHAT_TYPE } from "../lib/constants/chats";
import { isEmpty, size } from "lodash";
import { DATE_SPAN } from "../lib/constants/chats";
import ChatList from "../models/ChatList";
import { SEARCH_FILTER } from "../lib/constants/filterTypes";

const retries = 3;

class ChatService {
  async store(req, res) {
    const { body, userId } = req;
    let previousChatHistory = [];
    let { message, chatId, chatListId, chatModel } = body;
    let createdAt, chatCategoryId;
    let response, previousChat;

    if (chatId) {
      previousChat = await ChatGPT.findById(chatId).select("messages chatModel");

      previousChatHistory = previousChat?.messages?.map((message) => {
        return {
          role: message.sender === CHAT_ROLES.ASSISTANT ? "system" : message.sender,
          content: message.content,
        };
      });
    }

    if (chatId && previousChat?.chatModel) {
      if (previousChat?.chatModel === CHAT_MODEL.CHAT_GPT_3) {
        response = await OpenAIBot.fetchAnswer(
          previousChatHistory,
          message,
          CHAT_TYPE.CHAT,
          previousChat.chatModel
        );
      } else {
        // here i have to implement stream for continuing chat
        response = await LLama2Bot.fetchAnswer(previousChatHistory, message);
      }
    } else {
      response = await LLama2Bot.fetchAnswer(previousChatHistory, message);
    }
    // let formattedChat = await OpenAIBot.fetchAnswerDavinci(response);
    if (getPlainTextFromHTML(response) == message) {
      for (let i = 0; i < retries; i++) {
        response = await OpenAIBot.fetchAnswer(previousChatHistory, message);
        if (response !== message) break;
      }
    }

    const messageId = uuid();
    const senderMessage = {
      messageId: messageId,
      sender: CHAT_ROLES.USER,
      content: message,
    };
    const responseMessage = {
      messageId: uuid(),
      sender: CHAT_ROLES.ASSISTANT,
      content: response?.trim(),
      responseTo: messageId,
    };
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const userWordsCount: any = user?.wordsCount || 0;

    const responseString = String(responseMessage?.content);
    const plainTextResponse = responseString?.replace(/<[^>]*>/g, "");
    const characterCount = plainTextResponse.replace(/ /g, "").length;

    // update words
    const wordCount = Math.ceil(characterCount / 7);

    if (user) {
      const subscriptions = await Subscription.find();
      const findMatchingPlanTitle = (subscriptionId: string, subscriptions: any[]) => {
        for (const subscription of subscriptions) {
          const matchingPlan = subscription.plans.find((plan: any) => plan._id.toString() === subscriptionId?.toString());
          if (matchingPlan) return matchingPlan;
        }
        return null;
      };
      const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);

      if (matchingPlanTitle) {
        if (userWordsCount >= matchingPlanTitle?.wordsAllowed) {
          throw new Error("limit exceed please buy more words");
        }
        if (
          userWordsCount < matchingPlanTitle?.wordsAllowed &&
          matchingPlanTitle?.wordsAllowed < userWordsCount + wordCount
        ) {
          const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount) as number;
          throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
      }
    }
    if (!user.subscription) {
      let limit = 10000;
      if (userWordsCount >= limit) {
        throw new Error("Free limit exceed please buy subscription");
      }
      if (userWordsCount < limit && limit < userWordsCount + wordCount) {
        const remainingLimit = (limit - userWordsCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
      }
    }

    try {
      await User.findByIdAndUpdate(userId, { $inc: { wordsCount: wordCount } });
    } catch (error) {
      console.error("Error updating wordsCount:", error);
    }

    if (!chatId) {
      const chat = new ChatGPT({
        user: userId,
        messages: [senderMessage, responseMessage],
        chatList: chatListId || null,
        chatModel: chatModel,
      });

      await chat.save();
      chatId = chat._id;
      createdAt = chat.createdAt;
      chatCategoryId = chat.chatList || null;
    } else {
      const chat = await ChatGPT.findOne({ _id: chatId, user: userId });
      chat.messages.push(senderMessage);
      chat.messages.push(responseMessage);

      await chat.save();
      createdAt = chat.updatedAt;
      chatCategoryId = chat.chatList || null;
    }

    // return {
    //   message,
    //   response: response,
    //   messageId,
    //   chatListId: chatCategoryId,
    //   chatId,
    //   createdAt: createdAt,
    // };
    // Create New Message
// {
//   "chatId": "6583ce67dcc06955220887f3", // id to chatId
//   "message": "OOP",
//   "response": " **Greetings, Usama!**\n\nI understand you have a question for me. Without further ado, please let's dive into your inquiry.\n\n### Question\n\nWhat are some of the most important skills that a data scientist should possess?\n\n### Answer\n\nA data scientist must possess a variety of skills to excel in their field. Here are some of the most crucial ones:\n\n1. Programming Skills: A data scientist should be proficient in programming languages like Python, R, or SQL. They should also be familiar with data manipulation, processing, and analysis libraries such as NumPy, pandas, and matplotlib.\n2. Data Analysis and Interpretation: A data scientist should be able to analyze large datasets, identify patterns, and draw meaningful conclusions. They should also be able to communicate their findings effectively to stakeholders through visualizations and reports.\n3. Machine Learning: Machine learning is a significant aspect of data science. A data scientist should have a good understanding of supervised and unsupervised learning algorithms, including regression, classification, clustering, and neural networks.\n4. Business Acumen: A data scientist should have a basic understanding of business principles and be able to identify opportunities where data can drive decision-making processes. They should also be able to communicate with stakeholders about their needs and requirements.\n5. Communication Skills: A data scientist should be able to present complex technical concepts to non-technical people. They should have excellent written and verbal communication skills in English (or the local language).\n6. Curiosity and Creativity: A data scientist should be curious and creative, always looking for new ways to solve problems and improve processes. They should be open to exploring novel approaches and technologies.\n7. Ethics: A data scientist should be aware of ethical considerations related to data privacy, security, and bias. They should ensure that their work complies with relevant regulations and standards.\n8. Collaboration: A data scientist often works in teams, so they should be comfortable collaborating with others. They should also be able to work independently and manage their time effectively.\n9. Adaptability: The field of data science is constantly evolving, so a data scientist should be adaptable and willing to learn new techniques, tools, and technologies.\n10. Domain Knowledge: While not essential, having domain knowledge in a specific industry can be beneficial. For example, a healthcare data scientist should have some knowledge of medical terminology and practices.\n\nBy mastering these skills, a data scientist can extract valuable insights from data, help organizations make informed decisions, and advance their careers in this exciting and rapidly growing field.\n\nI hope this helps, Usama! Do you have any follow-up questions?",
//   "messageId": "gdfdfd-dfdf-2323-sdsds", // REesponse Object ID 
// "responseTo":"e0fc0638-0b59-4e41-9d45-220349ea6429",   // Msg Object ID 
// "createdAt": "2023-12-21T05:34:31.764Z"
// }

return {
    chatId,
    message,
    messageId: responseMessage.messageId,
    responseTo: messageId,
    response: response,
    createdAt: createdAt,
    chatListId: chatCategoryId,
  }
}

  async show(req) {
    const { body, userId } = req;
    const { chatId } = body;

    console.log('chat');
    const chats = await ChatGPT.findOne({ _id: chatId, user: userId }).populate({
      path: "chatList",
      select: "title color",
    });
    return { ...ObjectManipulator.distruct(chats) };
  }

  async showDetails(req) {
    const { body, userId } = req;
    const { chatId } = body;

    const chats = await ChatGPT.findOne({ _id: chatId, user: userId });
    return { ...ObjectManipulator.distruct(chats) };
  }

  async storeChatList(req) {
    const { body, userId } = req;
    const { chatListId } = body;

    const existingChatList = await ChatList.findOne({ _id: chatListId });
    if (!existingChatList) throw new Error("No Chat list found with this ID");

    const chat = new ChatGPT({ user: userId, chatList: chatListId });
    await chat.save();

    return { ...ObjectManipulator.distruct(chat) };
  }

  async promptAdvisor(req) {
    const { userId } = req;
    try {
      const chats = await ChatGPT.find({
        user: new mongoose.Types.ObjectId(userId),
      })
        .sort({ _id: -1 })
        .limit(1);

      const lastIndex = chats[0]?.messages.length - 1;
      const message =
        lastIndex >= 0 ? chats[0]?.messages[lastIndex].content : 'hi welcome to lokichat.lokichat is the platform for students';

      if (message && typeof message == "string" && message.length > 0) {
        const result = await OpenAIBot.promptAdvisor(message);

        const modifiedResult = result.map((line) =>
          line.replace(/^\d+\.\s*/, "")
        );
        const top10Questions = modifiedResult.slice(0, 10);

        return top10Questions;
      } else {
        throw new Error("No message found");
      }
    } catch (error) {
      console.log(error, "error");
      throw new Error(error?.message ?? error);
    }
  }

  async index(req) {
    const { userId, query } = req;
    const { dateSpan, search } = query;

    const match: any = {
      user: new mongoose.Types.ObjectId(userId),
      "messages.0": { $exists: true, $ne: [] },
    };
    if (size(search) > 0) {
      match["messages.0.content"] = { $regex: search, $options: "i" };
      match["messages.sender"] = CHAT_ROLES.USER;
    }

    const project = { messages: 1, createdAt: 1, updatedAt: 1 };

    const today = [
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      { $project: project },
      { $sort: { _id: -1 } },
    ];

    const lastWeek = [
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            $lt: new Date(new Date().setDate(new Date().getDate() - 1)),
          },
        },
      },
      { $project: project },
      { $sort: { _id: -1 } },
    ];

    const last30Days = [
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            $lt: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      { $project: project },
      { $sort: { _id: -1 } },
    ];

    const older = [
      {
        $match: {
          $expr: {
            $cond: {
              if: {
                $and: [
                  {
                    $ne: [
                      "$createdAt",
                      {
                        $dateToString: { format: "%Y-%m-%d", date: new Date() },
                      },
                    ],
                  },
                  {
                    $lt: [
                      "$createdAt",
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $subtract: [new Date(), 30 * 24 * 60 * 60 * 1000],
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      { $project: project },
      { $sort: { _id: -1 } },
    ];

    const facet: any = {};

    if (dateSpan === DATE_SPAN.TODAY) {
      facet.today = today;
    } else if (dateSpan === DATE_SPAN.LASTWEEK) {
      facet.lastWeek = lastWeek;
    } else if (dateSpan === DATE_SPAN.LAST30DAYS) {
      facet.last30Days = last30Days;
    } else if (dateSpan === DATE_SPAN.OLDER) {
      facet.older = older;
    } else {
      facet.today = today;
      facet.lastWeek = lastWeek;
      facet.last30Days = last30Days;
      facet.older = older;
    }

    const pipeline: any = [
      { $match: match },
      {
        $project: {
          messages: { $slice: ["$messages", 2] },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $facet: facet },
    ];

    const chats = await ChatGPT.aggregate(pipeline);

    const chatData = chats[0];

    chatData[DATE_SPAN.TODAY] = chatData?.today || [];
    chatData[DATE_SPAN.LASTWEEK] = chatData?.lastWeek || [];
    chatData[DATE_SPAN.LAST30DAYS] = chatData?.last30Days || [];
    chatData[DATE_SPAN.OLDER] = chatData?.older || [];

    return chatData;
  }

  async indexByPagination(req) {
    const { query, userId } = req;
    const { filter, search, page, resPerPage } = query;

    const searchFilter = search
      ? {"messages.content": {$regex: new RegExp(search, "i")}}
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

    const [chats, totalChats] = await Promise.all([
      ChatGPT.find({
        user: userId,
        ...searchFilter, // Include the search filter conditionally
        ...dateFilter, // Include the date filter conditionally
      })
        .sort({ _id: -1 })
        .skip(resPerPage * (page - 1))
        .limit(resPerPage)
        .select({ messages: { $slice: 2 }, chatList: 1, createdAt: 1, updatedAt: 1 }),

      ChatGPT.countDocuments({
        user: userId,
        ...searchFilter, // Include the search filter conditionally
        ...dateFilter, // Include the date filter conditionally
      }),
    ]);

    const availableChat = await ChatGPT.countDocuments({
      user: userId
    });

    return {
      chats,
      currentPage: Number(page),
      pages: Math.ceil(totalChats / resPerPage),
      totalChats: Number(totalChats),
      perPage: Number(resPerPage),
      isAvailableChat: availableChat > 0?true:false
    };
  }

  async update(req) {
    const { body, userId } = req;
    const { chatId, message, messageId } = body;

    const previousChatMessages = await ChatGPT.findById(chatId).select(
      "messages chatModel"
    );

    const previousChatHistory = previousChatMessages?.messages?.map(
      (message) => {
        return {
          role: message.sender === "chatbot" ? "system" : message.sender,
          content: message.content,
        };
      }
    );

    let response;
    if (previousChatMessages.chatModel && previousChatMessages.chatModel !== CHAT_MODEL.CHAT_GPT_3) {
      response = await LLama2Bot.fetchAnswer(previousChatHistory, message);
    } else {
      response = await OpenAIBot.fetchAnswer(
        previousChatHistory,
        message,
        CHAT_TYPE.CHAT,
        previousChatMessages?.chatModel
      );
    }
    if (getPlainTextFromHTML(response) == message) {
      for (let i = 0; i < retries; i++) {
        response = await OpenAIBot.fetchAnswer(previousChatHistory, message);
        if (response !== message) {
          break;
        }
      }
    }

    // let formattedResponse = await OpenAIBot.fetchAnswerDavinci(response);

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    const userWordsCount: any = user?.wordsCount || 0;

    const responseString = String(response);
    const plainTextResponse = responseString?.replace(/<[^>]*>/g, "");
    const characterCount = plainTextResponse.replace(/ /g, "").length;

    const wordCount = Math.ceil(characterCount / 7);

    if (user) {
      const subscriptions = await Subscription.find();
      const findMatchingPlanTitle = (
        subscriptionId: string,
        subscriptions: any[]
      ) => {
        for (const subscription of subscriptions) {
          const matchingPlan = subscription.plans.find(
            (plan: any) => plan._id.toString() === subscriptionId?.toString()
          );

          if (matchingPlan) {
            return matchingPlan;
          }
        }
        return null;
      };
      const matchingPlanTitle = findMatchingPlanTitle(
        user.subscription,
        subscriptions
      );

      if (matchingPlanTitle) {
        if (userWordsCount >= matchingPlanTitle?.wordsAllowed) {
          throw new Error("limit exceed please buy more words");
        }
        if (
          userWordsCount < matchingPlanTitle?.wordsAllowed &&
          matchingPlanTitle?.wordsAllowed < userWordsCount + wordCount
        ) {
          const remainingLimit = (matchingPlanTitle.wordsAllowed -
            userWordsCount) as number;
          throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
      }
    }
    if (!user.subscription) {
      let limit = 10000;
      if (userWordsCount >= limit) {
        throw new Error("Free limit exceed please buy subscription");
      }
      if (userWordsCount < limit && limit < userWordsCount + wordCount) {
        const remainingLimit = (limit - userWordsCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
      }
    }

    try {
      await User.findByIdAndUpdate(userId, { $inc: { wordsCount: wordCount } });
    } catch (error) {
      console.error("Error updating wordsCount:", error);
    }

    await ChatGPT.findOneAndUpdate(
      { _id: chatId, "messages.messageId": messageId },
      { $set: { "messages.$.content": message } },
      { new: true }
    );

    const responseMsgObj = await ChatGPT.findOneAndUpdate(
      { _id: chatId, "messages.responseTo": messageId },
      { $set: { "messages.$.content": response } },
      { new: true }
    );

    const msgObj = responseMsgObj?.messages?.find(el=> el?.responseTo == messageId);

    // return {
    //   _id: chatId,
    //   message: message,
    //   response: response,
    //   messageId: messageId,
    // };
    return {
      chatId,
      message,
      messageId: msgObj.messageId,
      responseTo: messageId,
      response: response,
    }
  }

  async reStore(req) {
    const { body, userId } = req;
    const { chatId, message, messageId } = body;

    const previousChatMessages = await ChatGPT.findById(chatId).select(
      "messages chatModel"
    );
    const previousChatHistory = previousChatMessages?.messages?.map(
      (message) => {
        return {
          role: message.sender === "chatbot" ? "system" : message.sender,
          content: message.content,
        };
      }
    );

    let response;
    if (previousChatMessages?.chatModel && previousChatMessages?.chatModel !== CHAT_MODEL.CHAT_GPT_3) {
      response = await LLama2Bot.fetchAnswer(previousChatHistory, message);
    } else {
      response = await OpenAIBot.fetchAnswer(
        previousChatHistory,
        message,
        CHAT_TYPE.CHAT,
        previousChatMessages?.chatModel
      );
    }

    if (getPlainTextFromHTML(response) == message) {
      for (let i = 0; i < retries; i++) {
        response = await OpenAIBot.fetchAnswer(previousChatHistory, message);
        if (response !== message) {
          break;
        }
      }
    }
    // let formattedResponse = await OpenAIBot.fetchAnswerDavinci(response);

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    const userWordsCount: any = user?.wordsCount || 0;

    const responseString = String(response);
    const plainTextResponse = responseString?.replace(/<[^>]*>/g, "");
    const characterCount = plainTextResponse.replace(/ /g, "").length;

    const wordCount = Math.ceil(characterCount / 7);

    if (user) {
      const subscriptions = await Subscription.find();
      const findMatchingPlanTitle = (
        subscriptionId: string,
        subscriptions: any[]
      ) => {
        for (const subscription of subscriptions) {
          const matchingPlan = subscription.plans.find(
            (plan: any) => plan._id.toString() === subscriptionId?.toString()
          );

          if (matchingPlan) {
            return matchingPlan;
          }
        }
        return null;
      };
      const matchingPlanTitle = findMatchingPlanTitle(
        user.subscription,
        subscriptions
      );

      if (matchingPlanTitle) {
        if (userWordsCount >= matchingPlanTitle?.wordsAllowed) {
          throw new Error("limit exceed please buy more words");
        }
        if (
          userWordsCount < matchingPlanTitle?.wordsAllowed &&
          matchingPlanTitle?.wordsAllowed < userWordsCount + wordCount
        ) {
          const remainingLimit = (matchingPlanTitle.wordsAllowed -
            userWordsCount) as number;
          throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
      }
    }
    if (!user.subscription) {
      let limit = 10000;
      if (userWordsCount >= limit) {
        throw new Error("Free limit exceed please buy subscription");
      }
      if (userWordsCount < limit && limit < userWordsCount + wordCount) {
        const remainingLimit = (limit - userWordsCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} words.`);
      }
    }

    try {
      await User.findByIdAndUpdate(userId, { $inc: { wordsCount: wordCount } });
    } catch (error) {
      console.error("Error updating wordsCount:", error);
    }
    const responseMsgObj = await ChatGPT.findOneAndUpdate(
      { _id: chatId, "messages.responseTo": messageId },
      { $set: { "messages.$.content": response } },
      { new: true }
    );

    const msgObj = responseMsgObj?.messages?.find(el=> el?.responseTo == messageId);

    // return {
    //   _id: chatId,
    //   message: message,
    //   response: response,
    //   messageId: messageId,
    // };

    return {
      chatId,
      message,
      messageId: msgObj.messageId,
      responseTo: messageId,
      response: response,
    }
  }

  async feedback(req) {
    const { body, userId } = req;
    const { chatId } = body;
    let { feedback } = body;
    feedback.rating = parseInt(feedback?.rating);

    if (
      feedback?.rating > 0 &&
      feedback?.rating < 6 &&
      !isEmpty(feedback?.comment)
    ) {
      const chat: any = await ChatGPT.findOne({ _id: chatId, user: userId });
      if (!chat) throw new Error("No chat found or invalid chatId");

      chat.feedback = feedback;
      await chat.save();
      return chat;
    } else throw new Error("Invalid feedback value");
  }

  async updateChatList(req) {
    const { body, userId } = req;
    let { chatId, chatListId } = body;

    const chatList = await ChatList.findOne({ _id: chatListId, user: userId });
    if (!chatList) throw new Error("No chat list id matched");

    const chat = await ChatGPT.findOne({ _id: chatId });
    if (!chat) throw new Error("No chat Id matched");
    if (chat.chatList == chatListId)
      throw new Error("This chat already belongs to same category.");

    chat.chatList = chatListId;

    await chat.save();
    return chat;
  }

  async storeGoal(req) {
    const { body, userId } = req;
    let { message, chatModel, chatId } = body;

    let messageId;
    let response;
    let chat;
    let createdAt;

    if (chatId) {
      response = await LLama2Bot.fetchAnswer([], message);
      chat = await ChatGPT.findById(chatId);
      if (isEmpty(chat)) throw new Error("No chat found with this Chat Id.");

      messageId = uuid();
      const responseBotMessage = {
        messageId: messageId,
        sender: "chatbot",
        content: response,
        responseTo: null,
      };

      chat.messages.push(responseBotMessage);
      await chat.save();
      response = response;
      createdAt = chat.messages[chat.messages.length - 1]?.createdAt;
    } else {
      messageId = uuid();
      const responseMessage = {
        messageId: messageId,
        sender: "chatbot",
        content: message?.trim(),
        responseTo: null,
      };
      chat = new ChatGPT({ user: userId, chatModel });
      chat.messages.push(responseMessage);
      await chat.save();
      response = message.trim();
      createdAt = chat.messages[chat.messages.length - 1]?.createdAt;
    }

    return {
      message: null,
      response: chat.messages[chat.messages?.length - 1].content,
      messageId: messageId,
      chatListId: null,
      chatId: chat._id,
      createdAt: createdAt,
    };
  }

  async deleteMessage(req) {
    const { body, userId} = req;
    const { messageId, chatId } = body;

    const result = await ChatGPT.updateOne(
      { _id: chatId, user: userId },
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

    const chat = await ChatGPT.findById(chatId);
    if(size(chat.messages) === 0) {
      await ChatGPT.findByIdAndDelete(chatId);
    }
    console.log('result', result);
    return result;
  }

  async updateMessage(req) {
    const { body, userId} = req;
    const { messageId, chatId, message, response } = body;

    await ChatGPT.findOneAndUpdate(
      { _id: chatId, "messages.messageId": messageId },
      { $set: { "messages.$.content": message } },
      { new: true }
    );

    await ChatGPT.findOneAndUpdate(
      { _id: chatId, "messages.responseTo": messageId },
      { $set: { "messages.$.content": response } },
      { new: true }
    );
    return "Chat reverted successfully";
  }
}

export default new ChatService();
