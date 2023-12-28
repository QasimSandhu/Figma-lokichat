import ILanguages from "src/interfaces/ILanguages";
import IVoiceLists from "../interfaces/IVoiceLists";
import mongoose, { Schema } from "mongoose";


const languageSchema = new Schema<ILanguages>({
    title: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      languageName: {
        type: String,
        required: true,
      },
      gender: {
        male: [
          {
            name: {
              type: String,
              required: true,
            },
            title: {
              type: String,
              required: true,
            },
          },
        ],
        female: [
          {
            name: {
              type: String,
              required: true,
            },
            title: {
              type: String,
              required: true,
            },
          },
        ],
      },
    }, { timestamps: true });

const LanguageList = mongoose.model<IVoiceLists>('languageList', languageSchema);

export default LanguageList