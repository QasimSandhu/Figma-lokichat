//@ts-ignore
import { v4 as uuid } from "uuid";
import User from "../models/User";
import DocumentSummarization from "../classes/DocumentSummarization";
import ChatGpt from "../models/Chat";
import ChatBot from "../classes/ChatBot";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { Socket } from "../classes/SocketIO";
import Notifications from "../models/Notifications";
import { CHAT_TYPE } from "../lib/constants/chats";

const socket = new Socket()

class DocumentSummerizationService {
  async generate(req) {
    const { userId, file } = req;

    const { chatId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    try {
      const text = await DocumentSummarization.getFileText(file)
      const originalName = file?.originalname || new Date().toString()

      if (text.length < 500) {
        throw new Error(
          "This document lacks valid or sufficient content for summarization."
        );
      }

      let previousChatHistory = [];
      if (chatId && chatId != undefined && chatId != "undefined") {
        const previousChatMessages = await ChatGpt.findById(chatId).select(
          "messages"
        );

        previousChatHistory = previousChatMessages?.messages?.map((message) => {
          return {
            role: message.sender === "chatbot" ? "system" : message.sender,
            content: message.content,
          };
        });
      }

      async function recursiveSummary(t: string): Promise<string> {
        try {
          let chunkArray = [];
        let startIndex = 0;
        while (startIndex < t.length) {
          chunkArray.push(t.substring(startIndex, startIndex + 4000));
          startIndex += 4000;
        }
        console.log(chunkArray, t.length, 'chunkarray');
        const responseArray = await Promise.all(chunkArray?.map(async (txt: string, ind: number) => {
          console.log(txt.length," length");
          const chunkRes = await ChatBot.fetchAnswer([], `${txt}.`, 'sum')
          return chunkRes;
        }))
        const result = responseArray.join(' ');
        const response = (result.length < 10000 && chunkArray.length < 2) ? result : await recursiveSummary(result);
        // return response?.replace(/\n/g, '<br /><br />');
        return response
        } catch (error) {
          throw new Error('Summary generation failed. Please review your file content and try again.')
        }
      }
      const result = await recursiveSummary(text);

      const messageId = uuid();
      const senderMessage = {
        messageId: messageId,
        sender: "user",
        content: `Summary for ${originalName}`,
      };
      const responseMessage = {
        messageId: uuid(),
        sender: "assistant",
        // content: `<h6 style='font-weight=25px;' ><b>Summary for ${originalName} :</b></h6> ${result?.trim()}`,
        content: `${result?.trim()}`,
        responseTo: messageId,
        type: "SUMMARY",
      };

      var createdChat: any;
      var createdAt: any;

      console.log(senderMessage,responseMessage," senderMessage");
      

      if (!chatId || chatId == undefined || chatId == "undefined") {
        createdChat = await ChatGpt.create({
          user: userId,
          messages: [senderMessage, responseMessage],
          type: "SUMMARY",
        });
        createdAt = createdChat.createdAt;
      } else {
        createdChat = await ChatGpt.findOne({ _id: chatId, user: userId });
        createdChat.messages.push(senderMessage);
        createdChat.messages.push(responseMessage);

        await createdChat.save();
        createdAt = createdChat.updatedAt;
      }
      if (createdChat) {
        const returningData = {
          message: `Summary for : ${originalName}`,
          response: `${result?.trim()}`,
          messageId,
          id: createdChat._id,
          createdAt: createdAt,
          type: "SUMMARY"
        };
        const notification = {
          title: 'Summary Generation Success.',
          user: userId,
          name: SOCKET_EVENT_TYPES.SUMMARY_STATUS,
          message: `Your Summary request has been completed successfully. Total words consumption is ${Number(result?.length)/7}`,
          from: userId,
          receivers: [userId]
        }
        
        
    
        const notifications = new Notifications(notification);
        await notifications.save();

        socket.emit(SOCKET_EVENT_TYPES.SUMMARY_STATUS,{
          isNotification:true,
          userIds:[userId]
      })
        return returningData
      } else {
        throw new Error("Failed to add chat to db.");
      }
    } catch (error) {
      console.log(error);
      throw new Error(error)
    }
  }

  static async recursiveSummary(t: string): Promise<string> {
    if(4000 < t?.length){
      return t;
    }
    let chunkArray = [];
    let startIndex = 0;
    while (startIndex < t.length) {
      chunkArray.push(t.substring(startIndex, startIndex + 4000));
      startIndex += 4000;
    }
    // console.log(chunkArray, t.length, 'chunkarray');
    const responseArray = await Promise.all(chunkArray?.map(async (txt: string, ind: number) => {
      const chunkRes = await ChatBot.fetchAnswer([], `${txt}.`, 'sum')
      return chunkRes;
    }))
    const result = responseArray.join(' ');
    const response = (result.length < 4000 && chunkArray.length < 2) ? result : await DocumentSummerizationService.recursiveSummary(result);
    return response;
    // return response?.replace(/\n/g, '<br /><br />');
  }

  async examMe(req) {
    const { userId } = req;
    const file = req.file;
    const chatId = req.body.chatId;
    const subject = req.body.subject;
    const type = req.body.type;
    const curChat = req.body.curChat;
    const domain = req.body.domain;

    if(!type || !['subject','chat','document'].includes(type)){
      throw new Error('Invalid type sent.')
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    var createdChat: any;
    var createdAt: any;
    var mcqResponse = '';

    try {
      if(type == 'subject'){
        mcqResponse = await ChatBot.fetchMCQS(type,{subject,domain})
      }else if(type == 'chat'){
        
        const allMessages = await ChatGpt.findById(chatId);
        
        const messagesArray = allMessages?.messages ?? allMessages?._doc?.messages;
        if(!messagesArray){
          throw new Error('Invalid or not applicable chat selected.');
        }
        console.log(messagesArray, " messageArray");
        
        let text = '';
        for(let i = 0;i<messagesArray?.length;i++){
          text += messagesArray[i]?.sender == 'user' 
          ? 
          `Question: ${messagesArray[i]?.content}`
          :
          `GPT Answer: ${messagesArray[i]?.content}`
        }
        // console.log(text," ===> text");
        const getSendableData = await DocumentSummerizationService.recursiveSummary(text);
        // console.log(getSendableData," ===> Get Send Able Data");
        
        mcqResponse = await ChatBot.fetchMCQS(type,{getSendableData});
      }else if(type == 'document'){
        console.log(file);
        let text = await DocumentSummarization.getFileText(file);
        const getSendableData = await DocumentSummerizationService.recursiveSummary(text);
        mcqResponse = await ChatBot.fetchMCQS(type,{getSendableData});
      }else{
        throw new Error('Invalid type sent')
      }

      const messageId = uuid();
      const senderMessage = {
        messageId: messageId,
        sender: "user",
        content: type == 'chat' ? `MCQ's for selected chat` : type == 'document' ? `MCQ's for ${file?.originalname ?? 'selected file'}` : `MCQ's for ${subject}(${domain})`,
      };
      const responseMessage = {
        messageId: uuid(),
        sender: "chatbot",
        // content: `<h6 style='font-weight=25px;' ><b>Summary for ${originalName} :</b></h6> ${result?.trim()}`,
        content: `${mcqResponse?.trim()}`,
        responseTo: messageId,
      };


      if (!curChat || curChat == undefined || curChat == "undefined") {
        createdChat = await ChatGpt.create({
          user: userId,
          messages: [senderMessage, responseMessage],
          type: CHAT_TYPE.EXAM,
        });
        createdAt = createdChat.createdAt;
      } else {
        createdChat = await ChatGpt.findOne({ _id: curChat, user: userId });
        createdChat.messages.push(senderMessage);
        createdChat.messages.push(responseMessage);

        await createdChat.save();
        createdAt = createdChat.updatedAt;
      }


      if (createdChat) {
        const returningData = {
          message: type == 'chat' ? `MCQ's for selected chat` : type == 'document' ? `MCQ's for ${file?.originalname ?? 'selected file'}` : `MCQ's for ${subject}(${domain})`,
          response: `${mcqResponse?.trim()}`,
          messageId,
          id: createdChat._id,
          createdAt: createdAt,
        };
        // const notification = {
        //   title: 'Summary Generation Success.',
        //   user: userId,
        //   name: SOCKET_EVENT_TYPES.SUMMARY_STATUS,
        //   message: `Your Summary request has been completed successfully. Total words consumption is ${Number(mcqResponse?.length)/7}`,
        //   from: '65291a4b64a424c209e8f360',
        //   receivers: [userId]
        // }
        
        // socket.emit(SOCKET_EVENT_TYPES.SUMMARY_STATUS,returningData)
    
        // const notifications = new Notifications(notification);
        // await notifications.save();
        return returningData
      } else {
        throw new Error("Failed to add chat to db.");
      }




    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new DocumentSummerizationService();
