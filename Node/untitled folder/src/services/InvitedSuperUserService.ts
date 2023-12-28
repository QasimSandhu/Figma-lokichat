import { MAIL_TYPES } from "../lib/constants/mailTypes";
import User from "../models/User";
import { sendMailtoUser } from "../lib/helpers/sendGridEmail";
import InvitedSuperUser from "../models/invitedSuperUser";
import { sendEmail } from "src/lib/helpers/sendMail";
import { sendEmailToInviteSuperUser } from "../lib/helpers/inviteSuperUser";

class InvitedSuperUserService {
  async inviteSuperUser(req) {
    try {
      const invitationCode = generateRandomString();

      const { name, email } = req.body;
const link=process.env.FRONTEND_REDIRECT_URI
      const existingUser = await User.findOne({ email: email?.toLowerCase() });
      if (existingUser) {
        console.log("error");
        
        throw new Error('User already exists');
      }
      const existingUserInInviteUsers = await InvitedSuperUser.findOne({ email: email?.toLowerCase() });
      if (existingUserInInviteUsers) {
        console.log("error");
        
        throw new Error('User already invited');
      }

      const invitedSuperUser = new InvitedSuperUser({ name, email, invitationCode });
      console.log("invitedSuperUser",invitedSuperUser);
      await invitedSuperUser.save();

      await sendMailtoUser(
        MAIL_TYPES.INVITE_SUPER_USER_MAIL,
        { name: name, email: email, invitationCode: invitationCode },
        email
      );

      // await sendEmailToInviteSuperUser(email,name,invitationCode,link);
      return "User invited successfully";
    } catch (err) {
      console.log(err,"error");
      
      throw err;
    }
  }
}

export default new InvitedSuperUserService();

// Function to generate a random code (placeholder, use a better method)
 const generateRandomString = (length = 9) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let referralCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }

  return referralCode;
};
