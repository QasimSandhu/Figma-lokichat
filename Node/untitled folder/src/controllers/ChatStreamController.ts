import fs from 'fs';
import axios from 'axios';
import readline from 'readline';

import ChatGPT from "../models/Chat";
import { v4 as uuid } from "uuid";
import { CHAT_MODEL, CHAT_ROLES } from "../lib/constants/chats";
import { isEmpty, size } from "lodash";
import { Socket } from "../classes/SocketIO";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { updateStreamWordsCounter, updateUserWordsCounter, verifyRemainingWords } from '../lib/helpers/subscrptions';
import User from '../models/User';
import Subscription from '../models/Subscription';

const deepInfraUrl = process.env.LLAMA2_MODEL_URL;
const deepInfraToken = process.env.LLAMA2_MODEL_KEY;
const deepInfraModel = 'meta-llama/Llama-2-70b-chat-hf';
const socket = new Socket();

const systemPrompt = {
  role: "system",
  content: `
  Your name is Loki who is an experienced professor who is proficient in multiple languages such as English, French, Spanish, Dutch etc. Your task is to provide the answer to the student in clear narration style paragraphs. Follow these instructions before initializing final response. 
 
  Rules:
  - Always reply in the language that the user is speaking 
  - Just start generating response rather than asking for clarifying question
  - ALWAYS RESPOSNE IN MARKDOWN FORMAT USING BOLD, HEADINGS, PARAGRAPHS AND LIST.
`,
// content: `Please give me a precise answer
};

class ChatStreamController {
  async storeStream(req, res) {

    const { userId, body } = req;
    let { message, chatModel, chatListId, chatId, messagePassCode }  = body;
    let oldMessages = [];
    let chat;

    if(!isEmpty(chatId)) {
      chat = await ChatGPT.findById(chatId).select('messages');
      if (isEmpty(chat)) {
        return res.status(400).json({success: false, message: "No chat found", status: 400});
      }
    }

    const user = await User.findById(userId);
    const subscriptions = await Subscription.find();
    try{
      await verifyRemainingWords(user, subscriptions);
    } catch(err) {
      return res.status(400).json({success: false, message: err.message, status: 400});
    }

    const filename = `${userId}_${messagePassCode}_${new Date().getTime()}`;
    let _messages = [systemPrompt];
    const newMessage = {
        role: CHAT_ROLES.USER,
        content: message
    }
    if(size(oldMessages) > 0) {
      const formattedMessages = oldMessages.map((msg: any)=>({
        role: msg.sender,
        content: msg.content
      }));
      _messages = [..._messages, ...formattedMessages];
    }

    _messages.push(newMessage);
    const messageId = uuid();
    const senderMessage = {
      messageId: messageId,
      sender: CHAT_ROLES.USER,
      content: message,
    };

    //@ts-ignore
    axios({
        method: "post",
        url: deepInfraUrl,
        data: {
          model: deepInfraModel,
          stream: true,
          temperature: 0.3,
          max_new_tokens: 4096,
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
               const responseMessage = {
                 messageId: uuid(),
                 sender: CHAT_ROLES.ASSISTANT,
                 content: full_text,
                 responseTo: messageId,
               };

               if(chatId) {
                chat.messages.push(senderMessage);
                chat.messages.push(responseMessage);
                await chat.save();
               } else {
                  chat = new ChatGPT({
                    user: userId,
                    messages: [senderMessage, responseMessage],
                    chatList: chatListId || null,
                    chatModel: chatModel,
                  });
                  await chat.save();
               }
               chatId = chat._id;
               const socketMsg = {
                id: chat._id,
                messageId,
                messagePassCode,
                message: message,
                response: full_text,
                chatList: chat.chatList || null,
                createdAt: chat?.messages[chat.messages.length - 1].timestamp,
              };
               socket.emit(`${SOCKET_EVENT_TYPES.CREATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
               await updateStreamWordsCounter(user, full_text, subscriptions);
               fs.unlink(`./${filename}.txt`, function () {
                  console.log("File");
               });
               console.log('Connection closed');
               response.data.unpipe(res);
             } catch (error) {
               console.log("Error in saving messages", error);
            //    throw new Error(`${error.message ?? "service error"}`);
             }
           });
         });
      })
      .catch((error) => {
        console.error("Request error:", error.message);
        // throw new Error("internal server error");
        res.status(500).json({success: false, message: "internal server error", status: 500});
      });
  }

  async updateStream(req, res) {
    const { body, userId } = req;
    const { chatId, message, messageId, messagePassCode } = body;
    let chat;

    chat = await ChatGPT.findById(chatId).select('messages chatModel chatList');
    if(isEmpty(chat))
      return res.status(400).json({success: false, message: "No chat found", status: 400});
    if(chat.chatModel && chat.chatModel !== CHAT_MODEL.LLAMA2_MODEL)
      return res.status(400).json({success: false, message: "invliad chat model", status: 400});

    const user = await User.findById(userId);
    const subscriptions = await Subscription.find();
    try{
      await verifyRemainingWords(user, subscriptions);
    } catch(err) {
      return res.status(400).json({success: false, message: err.message, status: 400});
    }

    const filename = `${userId}_${new Date().getTime()}`;
    let _messages = [
      systemPrompt,
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
          temperature: 0.3,
          max_new_tokens: 4096,
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
                messagePassCode,
                message: message,
                response: full_text,
                chatList: chat.chatList || null,
              };
               socket.emit(`${SOCKET_EVENT_TYPES.UPDATE_STREAM_COMPLETION}_${userId}`, { message: socketMsg });
               await updateStreamWordsCounter(user, full_text, subscriptions);
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

export default new ChatStreamController();