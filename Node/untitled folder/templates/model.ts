import mongoose, { Schema } from 'mongoose';

interface ItemplateName extends Document {
    name:string
}

const templateNameSchema = new Schema<ItemplateName>({
  name: {
    type: String
  }
}); 

const templateName = mongoose.model<ItemplateName>('templateName', templateNameSchema);

export default templateName;
