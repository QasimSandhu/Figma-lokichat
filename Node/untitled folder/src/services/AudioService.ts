import Audio from "../models/Audio";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import StorageUploader from "../classes/StorageUploader";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import { CONTENT_TYPE } from "../lib/constants/contentType";
import User from "../models/User";
import Subscription from "../models/Subscription";
import VoiceList from "../models/VoiceList";
import { size } from "lodash";
import { capitalizeFirstLetter } from "../lib/helpers/utils";
import AzureTranslator from '../classes/TextToSpeech/TextTranslation'
import { CHAT_LANGUAGES } from "../lib/constants/chats";
import ChatGpt from "../models/Chat";
import { convertTextToMp3 } from "../classes/TextToSpeech/TextToSpeechConvertor";
const fs = require('fs').promises;

class AudioService {
  async store(req) {
    const { body, userId } = req;
    let { text, chatId, gender, language, voiceName, voiceMode, speed, debateId } = body;

    if (!language) throw new Error("language is required");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const responseString = String(text);
    const plainTextResponse = responseString?.replace(/<[^>]*>/g, "");
    const characterCount = plainTextResponse.replace(/ /g, "").length;
    const wordCount = Math.ceil(characterCount / 7);
    const userAudioCount: any = user?.audioCount || 0;

    if (!user.subscription) {
      let limit = 2000;
      if (userAudioCount >= limit)
        throw new Error("Free limit exceed please buy subscription");
      if (userAudioCount < limit && limit < userAudioCount + wordCount) {
        const remainingLimit = (limit - userAudioCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} mins.`);
      }
    }
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

          if (matchingPlan) return matchingPlan;
        }
        return null;
      };
      const matchingPlanTitle = findMatchingPlanTitle(
        user.subscription,
        subscriptions
      );
      if (matchingPlanTitle) {
        if (userAudioCount >= matchingPlanTitle?.audioAllowed) {
          throw new Error("limit exceed please buy more minutes");
        }
        if (
          userAudioCount < matchingPlanTitle?.audioAllowed &&
          matchingPlanTitle?.audioAllowed < userAudioCount + wordCount
        ) {
          const remainingLimit = (matchingPlanTitle.audioAllowed -
            userAudioCount) as number;
          throw new Error(`Your remaining limit is ${remainingLimit} min.`);
        }
      }
    }

    let translatedText;
    let audioBuffer;
    if (language !== CHAT_LANGUAGES.EN) {
    
      // translatedText = await AzureTranslator.translateText(text, language);
   
      
      audioBuffer = await getAudioBuffer(
        text,
        voiceName,
        voiceMode,
        gender,
        language,
        speed,
        userId
      );
    } else {
      audioBuffer = await getAudioBuffer(
        text,
        voiceName,
        voiceMode,
        gender,
        language,
        speed,
        userId
      );
    }

    const audioId = uuid();
    if (audioBuffer?.error) {
      throw new Error(audioBuffer.message);
    }
    const uploadedUrl = await StorageUploader.uploadToAzureStorage(
      audioId,
      audioBuffer,
      CONTENT_TYPE.AUDIO
    );
    try {
      await User.findByIdAndUpdate(userId, { $inc: { audioCount: wordCount } });
    } catch (error) {
      console.error("Error updating wordsCount:", error);
    }
    let chat;
    if(chatId) {
      chat = await ChatGpt.findOne({ _id: chatId }).select("id").populate({
        path: "chatList",
        select: "title color",
      });
    }

    const audio = new Audio({
      text: text,
      user: userId,
      chat: chatId,
      debate: debateId,
      audioLabel: chat?.chatList?.title || null,
      audioColor: chat?.chatList?.color || null,
      language: language || CHAT_LANGUAGES.EN,
      audioFilePath: uploadedUrl,
      voiceIdentifier: capitalizeFirstLetter(gender),
    });
    await audio.save();
    return { ...ObjectManipulator.distruct(audio) };
  }

  async show(req) {
    const { body, userId } = req;
    let { audioId } = body;

    const audio = await Audio.findOne({
      _id: new mongoose.Types.ObjectId(audioId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!audio) {
      throw new Error("No audio found with this Id");
    }

    return { ...ObjectManipulator.distruct(audio) };
  }

  async update(req) {
    const { body, userId } = req;
    let { audioId, text, language, voiceName, gender, voiceMode,speed} = body;

    const audio = await Audio.findOne({ _id: audioId, user: userId });

    if (!audio) throw new Error("No audio found with this Id");

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    const responseString = String(text);
    const plainTextResponse = responseString?.replace(/<[^>]*>/g, "");
    const characterCount = plainTextResponse.replace(/ /g, "").length;
    const wordCount = Math.ceil(characterCount / 7);
    const userAudioCount: any = user?.audioCount || 0;
    if (!user.subscription) {
      let limit = 2000;
      if (userAudioCount >= limit) {
        throw new Error("Free limit exceed please buy subscription");
      }
      if (userAudioCount < limit && limit < userAudioCount + wordCount) {
        const remainingLimit = (limit - userAudioCount) as number;
        throw new Error(`Your remaining limit is ${remainingLimit} mins.`);
      }
    }
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
        if (userAudioCount >= matchingPlanTitle?.audioAllowed) {
          throw new Error("limit exceed please buy more minutes");
        }
        if (
          userAudioCount < matchingPlanTitle?.audioAllowed &&
          matchingPlanTitle?.audioAllowed < userAudioCount + wordCount
        ) {
          const remainingLimit = (matchingPlanTitle.audioAllowed -
            userAudioCount) as number;
          throw new Error(`Your remaining limit is ${remainingLimit} min.`);
        }
      }
    }

    let translatedText;
    let audioBuffer;

    if (language !== CHAT_LANGUAGES.EN) {
      // translatedText = await AzureTranslator.translateText(text, language);
      audioBuffer = await getAudioBuffer(
        text,
        voiceName,
        voiceMode,
        gender,
        language,
        speed,
        userId
      );
    } else {
      audioBuffer = await getAudioBuffer(
        text,
        voiceName,
        voiceMode,
        gender,
        language,
        speed,
        userId
      );
    }

    const audioBufferId = uuid();
    if (audioBuffer?.error) throw new Error(audioBuffer.message);
    const uploadedUrl = await StorageUploader.uploadToAzureStorage(
      audioBufferId,
      audioBuffer,
      CONTENT_TYPE.AUDIO
    );
    try {
      await User.findByIdAndUpdate(userId, { $inc: { audioCount: wordCount } });
    } catch (error) {
      console.error("Error updating wordsCount:", error);
    }
    audio.text = text;
    audio.voiceIdentifier = gender;
    audio.audioFilePath = uploadedUrl;

    await audio.save();

    return { ...ObjectManipulator.distruct(audio) };
  }

  async destroy(req) {
    const { params } = req;
    let { audioId } = params;

    if (!audioId) throw new Error("audioId is required");

    const deletedAudio = await Audio.findByIdAndDelete(audioId);

    if (!deletedAudio) {
      throw new Error("No audio found with this Id");
    }

    return { ...ObjectManipulator.distruct(deletedAudio) };
  }
}
const waitForFile = async (filePath) => {
  return new Promise(async (resolve) => {
    const checkFile = async () => {
      try {
        const buffer = await fs.readFile(filePath);
        resolve(buffer);
      } catch (error) {
        setTimeout(checkFile, 1000);
      }
    };

    checkFile();
  });
};
const getAudioBuffer = async (text, voiceName, voiceMode, gender, language,speed,userId) => {


  
  if (voiceName && voiceName.toLowerCase() === 'default') {
    voiceName = 'ar-XA-Wavenet-A'; 
  }

  if (voiceName) { 
    await convertTextToMp3(text, language, voiceName, gender,speed,voiceMode,userId);
    const audioBuffer = await waitForFile('audioFile.mp3');
    return audioBuffer;
  } else {
    const voiceLists = await VoiceList.find({
      gender: gender,
      language: { $regex: new RegExp(`^${language}`, 'i') },
    });
    if (size(voiceLists) === 0) throw new Error(`No language found with ${gender}`);
    await convertTextToMp3(text, language, voiceName, gender,speed,voiceMode,userId);
    const audioBuffer = await waitForFile('audioFile.mp3');

    return audioBuffer;
  }

}

export default new AudioService();
