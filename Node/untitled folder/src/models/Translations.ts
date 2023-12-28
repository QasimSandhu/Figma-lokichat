import mongoose from "mongoose";

const translationsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // chat: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ChatGpt",
    //   required: true,
    // },
    originalDocumentUrl: {
      type: String,
      required: true,
    },
    translatedDocumentUrl: {
      type: String,
      required: true,
    },
    totalCharacterCharged:{
      type:Number,
      required:true
    },
    getRequestBatchUrl:{
      type:String,
      required:true
    },
    type: {
      type: String,
      enum:['TEXT','DOCUMENT'],
      required: true,
    },
    translatedLanguage: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Translation = mongoose.model("Translation", translationsSchema);

export default Translation;
