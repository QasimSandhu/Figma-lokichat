import mongoose, {Schema} from 'mongoose';
import IPhotoGeneration from '../interfaces/IPhotoGeneration';

const photoGenerationSchema = new Schema<IPhotoGeneration>({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    negativePrompt: {
      type: String,
      required: false
    },
    imagePathUrls: [
      {
        type: String,
        required: false,
      }
    ],
    eta: {
      type: Number,
      required: false,
      default: 0,
    },
    imageId: {
      type: Number,
      required: false,
      default: null,
    }
  },
  { timestamps: true });
  
  const PhotoGeneration = mongoose.model<IPhotoGeneration>('PhotoGeneration', photoGenerationSchema);

  export default PhotoGeneration;

