import fs from 'fs';
import axios from 'axios';
import readline from 'readline';

import ChatGPT from "../models/Chat";
import { v4 as uuid } from "uuid";
import { CHAT_MODEL, CHAT_ROLES } from "../lib/constants/chats";
import { isEmpty, size } from "lodash";
import { DATE_SPAN } from "../lib/constants/chats";
import ChatList from "../models/ChatList";
import { SEARCH_FILTER } from "../lib/constants/filterTypes";
import { Socket } from "../classes/SocketIO";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { USER_ROLES } from "../lib/constants/user";
import Debate from '../models/Debate';
import { getPlainTextFromHTML } from '../lib/helpers/textFormatting';
import { DEBATE_NEW_MESSAGE } from '../lib/constants/debate';
import Notifications from "../models/Notifications";

const deepInfraUrl = process.env.LLAMA2_MODEL_URL;
const deepInfraToken = process.env.LLAMA2_MODEL_KEY;
const deepInfraModel = 'meta-llama/Llama-2-70b-chat-hf';
const socket = new Socket();

class StreamController {
  async updateStream(req, res) {

    const { userId, body } = req;
    const { message, debateId, mentionedUsers, isBotMentioned, responseTo } = body;

    const debate = await Debate.findById(debateId);
    if (!debate) {
        res.status(400).json({success: false, message: "no debate found with this id", status: 400});
    }

    const updatedMessage = {
      sender: userId,
      message: message,
      mentionedUsers: mentionedUsers || [],
      isBotMentioned: isBotMentioned || false,
      responseTo: responseTo || null,
      readBy: [userId]
    };
    debate.messages.push(updatedMessage);
    await debate.save();
    if (isBotMentioned) {

      const debateMsg = getPlainTextFromHTML(message);
      // here will have to make that process.
        const filename = `${userId}_${new Date().getTime()}`;
    let _messages = [
      {
        role: "system",
        content: `!IMPORTANT [NOTE] ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.`,
      },
    ];
    const newMessage = {
        role: CHAT_ROLES.USER,
        content: debateMsg
    }
    
    _messages.push(newMessage);
    const messageId = uuid();

    // const botResponse = await LLama2Bot.fetchAnswer([],debateMsg);

    //@ts-ignore
    axios({
        method: "post",
        url: deepInfraUrl,
        data: {
          model: deepInfraModel,
          stream: true,
          temperature: 0.3,
          max_new_tokens: 1096,
          messages: _messages,
        },
        responseType: "stream",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepInfraToken}`,
        },
      }
    )
      .then((response: any) => {
        response.data.pipe(res);
        response.data.pipe(fs.createWriteStream(`${filename}.txt`));
        response.data.on("end", () => {
            res.end()
           const fileStream = fs.createReadStream(`${filename}.txt`);
           const rl = readline.createInterface({
             input: fileStream,
             crlfDelay: Infinity,
           });
           let full_text = "";
           rl.on("line", (line: any) => {
             if (line.length > 0 && line.includes("data")) {
               line = line.replace("data: ", "");
               if (line !== "[DONE]") {
                try {
                  line = JSON.parse(line);
                  full_text += line?.choices[0]?.delta?.content ?? "";
                } catch (error: any) {
                  console.log('stream error', error);
                //   throw new Error(`'Stream Error: '${error?.message ?? ''}`);
                }
               }
             }
           });
            rl.on("close", async () => {
            try {
               console.log("Here Full text", full_text);

               const lastMessageIdx = size(debate.messages);
               const botMessage = {
                 sender: userId,
                 message: full_text,
                 mentionedUsers: mentionedUsers || [],
                 isBotResponse: true,
                 responseTo: debate.messages[lastMessageIdx - 1]?._id,
                 readBy: [userId]
               };
               debate.messages.push(botMessage);
               await debate.save();

            //    const socketMsg = {
            //     id: chat._id,
            //     title: chat?.title,
            //     color: chat?.color,
            //     message: message,
            //     response: full_text,
            //     messageId,
            //     createdAt: chat?.messages[chat.messages.length - 1].timestamp,
            //   };
            //   console.log('socketMsg', socketMsg);
            //    socket.emit(`${SOCKET_EVENT_TYPES.CREATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
               fs.unlink(`./${filename}.txt`, function () {
                 console.log("File");
               });
            } catch (error) {
               console.log("Error in saving messages", error);
            //    throw new Error(`${error.message ?? "service error"}`);
            }
           });
         });
      })
      .catch((error) => {
        res.end()
        console.error("Request error:", error.message);
        // throw new Error("internal server error");
        res.status(500).json({success: false, message: "internal server error", status: 500});
      });
    }

    let notificationReceivers = [...debate.invitedUsers, debate.user];
    notificationReceivers = notificationReceivers.filter((id) => id != userId);
    const notification = {
      title: `${DEBATE_NEW_MESSAGE}`,
      name: SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION,
      message: `You have a new message in ${debate.title} debate.`,
      from: userId,
      receivers: notificationReceivers,
    };

    const notifications = new Notifications(notification);
    await notifications.save();

    await debate.populate({
      path: "user invitedUsers messages.sender",
      select: "email userName profileUrl",
    });

    pushNewMessageNotification(debate, notificationReceivers);
    const formattedDebate = formatData(debate);
    return res.status(200).json({ success: true, data: formattedDebate, status: 200 });
  }

  async updateStreamMessage(req, res) {
    const { body, userId } = req;
    const { chatId, message, messageId } = body;
    let chat;

    chat = await ChatGPT.findById(chatId).select('messages chatModel');
    if(isEmpty(chat))
      return res.status(400).json({success: false, message: "No chat found", status: 400});
    if(chat.chatModel && chat.chatModel !== CHAT_MODEL.LLAMA2_MODEL)
      return res.status(400).json({success: false, message: "invliad chat model", status: 400});

    const filename = `${userId}_${new Date().getTime()}`;
    let _messages = [
      {
        role: "system",
        content: `!IMPORTANT NOTE ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.`,
      },
      {
        role: CHAT_ROLES.USER,
        content: message,
      },
    ];

    //@ts-ignore
    axios({
        method: "post",
        url: deepInfraUrl,
        data: {
          model: deepInfraModel,
          stream: true,
          // temperature: 0.3,
          // max_new_tokens: 1096,
          messages: _messages,
        },
        responseType: "stream",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepInfraToken}`,
        },
      }
    )
      .then((response: any) => {
        response.data.pipe(res);
        response.data.pipe(fs.createWriteStream(`${filename}.txt`));
        response.data.on("end", () => {
           const fileStream = fs.createReadStream(`${filename}.txt`);
           const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
           let full_text = "";
           rl.on("line", (line: any) => {
             if (line.length > 0 && line.includes("data")) {
               line = line.replace("data: ", "");
               if (line !== "[DONE]") {
                try {
                  line = JSON.parse(line);
                  full_text += line?.choices[0]?.delta?.content ?? "";
                } catch (error: any) {
                  console.log('stream error', error);
                  throw new Error(`'Stream Error: '${error?.message ?? ''}`);
                }
               }
             }
           });
           rl.on("close", async () => {
             try {
               console.log("Here Full text", full_text);

               await ChatGPT.findOneAndUpdate(
                { _id: chatId, "messages.messageId": messageId },
                { $set: { "messages.$.content": message } },
                { new: true }
              );
          
              await ChatGPT.findOneAndUpdate(
                { _id: chatId, "messages.responseTo": messageId },
                { $set: { "messages.$.content": full_text } },
                { new: true }
              );

              const socketMsg = {
                id: chatId,
                messageId,
                message: message,
                response: full_text,
              };
              console.log('socketMsg', socketMsg);
               socket.emit(`${SOCKET_EVENT_TYPES.UPDATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
               fs.unlink(`./${filename}.txt`, function () {
                 console.log("Error");
               });
             } catch (error) {
               console.log("Error in saving messages", error);
             }
           });
         });
      })
      .catch((error) => {
        console.error("Request error:", error);
      });
  }
}

  const pushNewMessageNotification = (debate: any, notificationReceivers: any[]) => {
    for (let i = 0; i < size(notificationReceivers); i++) {
      socket.emit(
        `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`,
        { message: debate.messages[debate.messages.length - 2] }
      );
      socket.emit(
        `${SOCKET_EVENT_TYPES.DEBATE_NOTIFICATION}_${notificationReceivers[i]}`,
        { message: debate.messages[debate.messages.length - 1] }
      );
    }
  }

  const formatMessage = (message: any) => {
    return {
        id: message._id,
        sender: message.sender,
        message: message.message,
        mentionedUsers: message.mentionedUsers,
        isBotMentioned: message.isBotMentioned,
        isBotResponse: message.isBotResponse,
        responseTo: message.responseTo,
        createdAt: message.createdAt
      };
  }

  const formatData = (data: any) => {
    const formattedMessages = data.messages?.map(formatMessage)
    return {
      id: data._id,
      user: data.user,
      title: data.title,
      invitedUsers: data.invitedUsers,
      leavedDebateUsers: data.leavedDebateUsers,
      messages: formattedMessages,
      createdAt: data.createdAt
    };
  }

export default new StreamController();