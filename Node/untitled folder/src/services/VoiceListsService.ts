import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import GetListVoices from "../classes/TextToSpeech/ListVoices";
import VoiceList from "../models/VoiceList";
import { size } from "lodash";

class ChatService {
  constructor() {
    // this.store = this.store.bind(this);
    this.index = this.index.bind(this);
  }
  // async store() {
  //   const result = await insertVoicesListData();
  //   return result;
  // }

  async index() {
    let voiceLists: any = await VoiceList.find({});
    return voiceLists;
  }
}

export default new ChatService();
