import mongoose, { Schema } from "mongoose";
import IInvitedSuperUser from "../interfaces/IInvitedSuperUser";


const InvitedSuperUserSchema = new Schema<IInvitedSuperUser>({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      invitationCode:{
        type: String,
        required: true,
      }
    }, { timestamps: true });

const InvitedSuperUser = mongoose.model<IInvitedSuperUser>('InvitedSuperUser', InvitedSuperUserSchema);

export default InvitedSuperUser