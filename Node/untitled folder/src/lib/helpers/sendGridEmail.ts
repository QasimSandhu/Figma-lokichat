import {
  audioSharingTemplate,
  debateApprovedTemplate,
  debateRequestTemplate,
  FailedPaymentTemplates,
  forgotPasswordTemplate,
  goalTemplate,
  limitReachedTemplate,
  otpTemplate,
  RefferFriendTemplate,
  SuperUserApprovedTemplate,
  SuperUserRequestTemplate,
  SupscriptionExpiredTemplate,
  welcomeTemplate,
  IntivtedSuperUserTemplate,
} from "../templates/index";
import { MAIL_TYPES } from "../constants/mailTypes";
import Mailjet from "node-mailjet";

export async function sendGridEmail(
  to: string,
  html: string,
  subject: string = "Loki Chat Mailer"
) {
  try {
    const mailjetClient = Mailjet.apiConnect(
      "d76d7ac87278c2837e755fb617222033",
      "3a72618af20820b43b8b07c7b8d85746"
    );
    console.log(to, " email");
    

    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "noreply@lokichat.com",
            Name: "Loki Chat",
          },
          To: [
            {
              Email: to,
              Name: "USER",
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    const response = await request;
    console.log("mail jet response sent");
  } catch (error) {
    console.error("errResponse", error.response);

    if (error?.response) {
      console.error(error?.response?.body);
    }
  }
}

export async function sendMailtoUser(type: string, data: any = {}, to: any) {
  try {
    switch (type) {
      case MAIL_TYPES.AUDIO_SHARED_MAIL:
        await sendGridEmail(to, audioSharingTemplate());
        break;
      case MAIL_TYPES.DEBATE_REQUEST_APPROVED_MAIL:
        await sendGridEmail(to, debateApprovedTemplate(data?.name));
        break;
      case MAIL_TYPES.DEBATE_REQUEST_MAIL:
        await sendGridEmail(
          to,
          debateRequestTemplate(
            data?.name,
            data?.topic,
            data?.time,
            data.date,
            data?.avatart
          )
        );
        break;
      case MAIL_TYPES.FAILED_PAYMENT_MAIL:
        await sendGridEmail(to, FailedPaymentTemplates(data.name));
        break;
      case MAIL_TYPES.FORGOT_PASSWORD_MAIL:
        await sendGridEmail(to, forgotPasswordTemplate(data?.name, data.otp));
        break;
      case MAIL_TYPES.GOAL_MAIL:
        await sendGridEmail(to, goalTemplate(data?.time));
        break;
      case MAIL_TYPES.LIMIT_REACHED_MAIL:
        await sendGridEmail(to, limitReachedTemplate(data.name));
        break;
      case MAIL_TYPES.OTP_MAIL:
        await sendGridEmail(
          to,
          otpTemplate(data?.name, data?.email, data?.otp)
        );
        break;
      case MAIL_TYPES.REFFER_FRIEND_MAIL:
        await sendGridEmail(to, RefferFriendTemplate(data?.name));
        break;
      case MAIL_TYPES.SUPER_USER_APPROVED_MAIL:
        await sendGridEmail(to, SuperUserApprovedTemplate(data?.name));
        break;
      case MAIL_TYPES.SUPER_USER_REQUEST_MAIL:
        await sendGridEmail(to, SuperUserRequestTemplate(data?.name));
        break;
      case MAIL_TYPES.SUBSCRIPTION_EXPIRED_MAIL:
        await sendGridEmail(to, SupscriptionExpiredTemplate(data?.name));
        break;
      case MAIL_TYPES.WELCOME_MAIL:
        await sendGridEmail(to, welcomeTemplate(data?.name));
        break;
      case MAIL_TYPES.INVITE_SUPER_USER_MAIL:
        await sendGridEmail(
          to,
          IntivtedSuperUserTemplate(data?.name, data.invitationCode)
        );
        break;
      default:
        console.log("Invalid Mail Type");
        break;
    }
  } catch (error) {
    console.log(error);
  }
}
