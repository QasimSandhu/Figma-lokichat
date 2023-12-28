"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Audio_1 = __importDefault(require("../models/Audio"));
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const StorageUploader_1 = __importDefault(require("../classes/StorageUploader"));
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
const contentType_1 = require("../lib/constants/contentType");
const User_1 = __importDefault(require("../models/User"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const VoiceList_1 = __importDefault(require("../models/VoiceList"));
const lodash_1 = require("lodash");
const utils_1 = require("../lib/helpers/utils");
const chats_1 = require("../lib/constants/chats");
const Chat_1 = __importDefault(require("../models/Chat"));
const TextToSpeechConvertor_1 = require("../classes/TextToSpeech/TextToSpeechConvertor");
const fs = require('fs').promises;
class AudioService {
    store(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { text, chatId, gender, language, voiceName, voiceMode, speed, debateId } = body;
            if (!language)
                throw new Error("language is required");
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            const responseString = String(text);
            const plainTextResponse = responseString === null || responseString === void 0 ? void 0 : responseString.replace(/<[^>]*>/g, "");
            const characterCount = plainTextResponse.replace(/ /g, "").length;
            const wordCount = Math.ceil(characterCount / 7);
            const userAudioCount = (user === null || user === void 0 ? void 0 : user.audioCount) || 0;
            if (!user.subscription) {
                let limit = 2000;
                if (userAudioCount >= limit)
                    throw new Error("Free limit exceed please buy subscription");
                if (userAudioCount < limit && limit < userAudioCount + wordCount) {
                    const remainingLimit = (limit - userAudioCount);
                    throw new Error(`Your remaining limit is ${remainingLimit} mins.`);
                }
            }
            if (user) {
                const subscriptions = yield Subscription_1.default.find();
                const findMatchingPlanTitle = (subscriptionId, subscriptions) => {
                    for (const subscription of subscriptions) {
                        const matchingPlan = subscription.plans.find((plan) => plan._id.toString() === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()));
                        if (matchingPlan)
                            return matchingPlan;
                    }
                    return null;
                };
                const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
                if (matchingPlanTitle) {
                    if (userAudioCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.audioAllowed)) {
                        throw new Error("limit exceed please buy more minutes");
                    }
                    if (userAudioCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.audioAllowed) &&
                        (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.audioAllowed) < userAudioCount + wordCount) {
                        const remainingLimit = (matchingPlanTitle.audioAllowed -
                            userAudioCount);
                        throw new Error(`Your remaining limit is ${remainingLimit} min.`);
                    }
                }
            }
            let translatedText;
            let audioBuffer;
            if (language !== chats_1.CHAT_LANGUAGES.EN) {
                // translatedText = await AzureTranslator.translateText(text, language);
                audioBuffer = yield getAudioBuffer(text, voiceName, voiceMode, gender, language, speed, userId);
            }
            else {
                audioBuffer = yield getAudioBuffer(text, voiceName, voiceMode, gender, language, speed, userId);
            }
            const audioId = (0, uuid_1.v4)();
            if (audioBuffer === null || audioBuffer === void 0 ? void 0 : audioBuffer.error) {
                throw new Error(audioBuffer.message);
            }
            const uploadedUrl = yield StorageUploader_1.default.uploadToAzureStorage(audioId, audioBuffer, contentType_1.CONTENT_TYPE.AUDIO);
            try {
                yield User_1.default.findByIdAndUpdate(userId, { $inc: { audioCount: wordCount } });
            }
            catch (error) {
                console.error("Error updating wordsCount:", error);
            }
            let chat;
            if (chatId) {
                chat = yield Chat_1.default.findOne({ _id: chatId }).select("id").populate({
                    path: "chatList",
                    select: "title color",
                });
            }
            const audio = new Audio_1.default({
                text: text,
                user: userId,
                chat: chatId,
                debate: debateId,
                audioLabel: ((_a = chat === null || chat === void 0 ? void 0 : chat.chatList) === null || _a === void 0 ? void 0 : _a.title) || null,
                audioColor: ((_b = chat === null || chat === void 0 ? void 0 : chat.chatList) === null || _b === void 0 ? void 0 : _b.color) || null,
                language: language || chats_1.CHAT_LANGUAGES.EN,
                audioFilePath: uploadedUrl,
                voiceIdentifier: (0, utils_1.capitalizeFirstLetter)(gender),
            });
            yield audio.save();
            return Object.assign({}, ObjectDestructurer_1.default.distruct(audio));
        });
    }
    show(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { audioId } = body;
            const audio = yield Audio_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(audioId),
                user: new mongoose_1.default.Types.ObjectId(userId),
            });
            if (!audio) {
                throw new Error("No audio found with this Id");
            }
            return Object.assign({}, ObjectDestructurer_1.default.distruct(audio));
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            let { audioId, text, language, voiceName, gender, voiceMode, speed } = body;
            const audio = yield Audio_1.default.findOne({ _id: audioId, user: userId });
            if (!audio)
                throw new Error("No audio found with this Id");
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            const responseString = String(text);
            const plainTextResponse = responseString === null || responseString === void 0 ? void 0 : responseString.replace(/<[^>]*>/g, "");
            const characterCount = plainTextResponse.replace(/ /g, "").length;
            const wordCount = Math.ceil(characterCount / 7);
            const userAudioCount = (user === null || user === void 0 ? void 0 : user.audioCount) || 0;
            if (!user.subscription) {
                let limit = 2000;
                if (userAudioCount >= limit) {
                    throw new Error("Free limit exceed please buy subscription");
                }
                if (userAudioCount < limit && limit < userAudioCount + wordCount) {
                    const remainingLimit = (limit - userAudioCount);
                    throw new Error(`Your remaining limit is ${remainingLimit} mins.`);
                }
            }
            if (user) {
                const subscriptions = yield Subscription_1.default.find();
                const findMatchingPlanTitle = (subscriptionId, subscriptions) => {
                    for (const subscription of subscriptions) {
                        const matchingPlan = subscription.plans.find((plan) => plan._id.toString() === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()));
                        if (matchingPlan) {
                            return matchingPlan;
                        }
                    }
                    return null;
                };
                const matchingPlanTitle = findMatchingPlanTitle(user.subscription, subscriptions);
                if (matchingPlanTitle) {
                    if (userAudioCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.audioAllowed)) {
                        throw new Error("limit exceed please buy more minutes");
                    }
                    if (userAudioCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.audioAllowed) &&
                        (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.audioAllowed) < userAudioCount + wordCount) {
                        const remainingLimit = (matchingPlanTitle.audioAllowed -
                            userAudioCount);
                        throw new Error(`Your remaining limit is ${remainingLimit} min.`);
                    }
                }
            }
            let translatedText;
            let audioBuffer;
            if (language !== chats_1.CHAT_LANGUAGES.EN) {
                // translatedText = await AzureTranslator.translateText(text, language);
                audioBuffer = yield getAudioBuffer(text, voiceName, voiceMode, gender, language, speed, userId);
            }
            else {
                audioBuffer = yield getAudioBuffer(text, voiceName, voiceMode, gender, language, speed, userId);
            }
            const audioBufferId = (0, uuid_1.v4)();
            if (audioBuffer === null || audioBuffer === void 0 ? void 0 : audioBuffer.error)
                throw new Error(audioBuffer.message);
            const uploadedUrl = yield StorageUploader_1.default.uploadToAzureStorage(audioBufferId, audioBuffer, contentType_1.CONTENT_TYPE.AUDIO);
            try {
                yield User_1.default.findByIdAndUpdate(userId, { $inc: { audioCount: wordCount } });
            }
            catch (error) {
                console.error("Error updating wordsCount:", error);
            }
            audio.text = text;
            audio.voiceIdentifier = gender;
            audio.audioFilePath = uploadedUrl;
            yield audio.save();
            return Object.assign({}, ObjectDestructurer_1.default.distruct(audio));
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params } = req;
            let { audioId } = params;
            if (!audioId)
                throw new Error("audioId is required");
            const deletedAudio = yield Audio_1.default.findByIdAndDelete(audioId);
            if (!deletedAudio) {
                throw new Error("No audio found with this Id");
            }
            return Object.assign({}, ObjectDestructurer_1.default.distruct(deletedAudio));
        });
    }
}
const waitForFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const checkFile = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const buffer = yield fs.readFile(filePath);
                resolve(buffer);
            }
            catch (error) {
                setTimeout(checkFile, 1000);
            }
        });
        checkFile();
    }));
});
const getAudioBuffer = (text, voiceName, voiceMode, gender, language, speed, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (voiceName && voiceName.toLowerCase() === 'default') {
        voiceName = 'ar-XA-Wavenet-A';
    }
    if (voiceName) {
        yield (0, TextToSpeechConvertor_1.convertTextToMp3)(text, language, voiceName, gender, speed, voiceMode, userId);
        const audioBuffer = yield waitForFile('audioFile.mp3');
        return audioBuffer;
    }
    else {
        const voiceLists = yield VoiceList_1.default.find({
            gender: gender,
            language: { $regex: new RegExp(`^${language}`, 'i') },
        });
        if ((0, lodash_1.size)(voiceLists) === 0)
            throw new Error(`No language found with ${gender}`);
        yield (0, TextToSpeechConvertor_1.convertTextToMp3)(text, language, voiceName, gender, speed, voiceMode, userId);
        const audioBuffer = yield waitForFile('audioFile.mp3');
        return audioBuffer;
    }
});
exports.default = new AudioService();
//# sourceMappingURL=AudioService.js.map