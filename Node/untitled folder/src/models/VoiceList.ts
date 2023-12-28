import IVoiceLists from "../interfaces/IVoiceLists";
import mongoose, { Schema } from "mongoose";


const voiceListSchema = new Schema<IVoiceLists>({
  languageCodes: {
    type: Schema.Types.Mixed,
    required: true,
    set: function (value: string | string[]) {
      if (Array.isArray(value)) {
        return value?.length > 0 ? value[0] : '';
      }
      return value;
    },
  },
  ssmlGender: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  naturalSampleRateHertz: {
    type: Number,
  },
  characterName: {
    type: String,
  }
}, { timestamps: true });

const VoiceList = mongoose.model<IVoiceLists>('VoiceList', voiceListSchema);

export default VoiceList