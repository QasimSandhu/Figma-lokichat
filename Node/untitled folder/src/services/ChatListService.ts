import ChatGPT from "../models/Chat";
import mongoose from "mongoose";
import { isEmpty, size } from "lodash";
import ChatList from "../models/ChatList";
import { CHAT_ROLES, DATE_SPAN } from "../lib/constants/chats";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import { SEARCH_FILTER } from "../lib/constants/filterTypes";

class ChatService {
  async show(req) {
    const { query, userId } = req;

    const { dateSpan, search, chatListId } = query;

    if (isEmpty(chatListId)) throw new Error("chatList ID is required");
    let chatLists: any;
    chatLists = await ChatList.findOne({ _id: chatListId, user: userId });
    if (!chatLists) throw new Error("Chat list does not exists");

    const match: any = {
      user: new mongoose.Types.ObjectId(userId),
      chatList: new mongoose.Types.ObjectId(chatLists._id),
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

    chatLists.chats = chatData;

    const returnedObject: any = {
      id: chatLists._id,
      user: chatLists.user,
      title: chatLists.title,
      color: chatLists.color,
      createdAt: chatLists.createdAt,
      chatData: chatData,
    };

    return { ...ObjectManipulator.distruct(returnedObject) };
  }
  async showByPagination(req) {
    const { query, userId } = req;
    const { filter, search, chatListId, page, resPerPage } = query;

    const searchFilter = search
      ? {
          "messages.content": {
            $regex: new RegExp(search, "i"), // 'i' for case-insensitive search
          },
        }
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
        chatList: chatListId,
        user: userId,
        ...searchFilter, // Include the search filter conditionally
        ...dateFilter, // Include the date filter conditionally
      })
        .sort({ _id: -1 })
        .skip(resPerPage * (page - 1))
        .limit(resPerPage)
        .select({ messages: { $slice: 2 }, chatList: 1, createdAt: 1, updatedAt: 1 }),

      ChatGPT.countDocuments({
        chatList: chatListId,
        user: userId,
        ...searchFilter, // Include the search filter conditionally
        ...dateFilter, // Include the date filter conditionally
      }),
    ]);

    return {
      chats,
      currentPage: Number(page),
      pages: Math.ceil(totalChats / resPerPage),
      totalChats: Number(totalChats),
      perPage: Number(resPerPage),
    };
  }

  async store(req) {
    const { body, userId } = req;
    let { title, color } = body;

    const chatList = new ChatList({
      title,
      color,
      user: userId,
    });

    await chatList.save();
    return chatList;
  }

  async index(req) {
    const { userId } = req;
    const pipeline: any = [
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          title: 1,
          color: 1,
          createdAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];

    const chatLists: any = await ChatList.aggregate(pipeline);
    for (let i = 0; i < size(chatLists); i++) {
      const chatsCount = await ChatGPT.countDocuments({
        user: userId,
        chatList: chatLists[i]?._id,
        // $expr: { $gt: [{ $size: "$messages" }, 0] },
      });
      chatLists[i].chatsCount = chatsCount || 0;
    }
    return chatLists;
  }

  async export(req) {
    const { body, userId } = req;
    const { chatListIds } = body;
    if (size(chatListIds) === 0)
      throw new Error("At least one chat id is required to export");
    const chats = await ChatGPT.find({
      chatList: { $in: chatListIds },
      user: userId,
      $expr: { $gt: [{ $size: "$messages" }, 0] },
    })
      .sort({ _id: -1 })
      .select("_id messages title createdAt");

    return chats;
  }
}

export default new ChatService();
