import User from "../models/User";
import { SUPER_USER_STATUS, USER_ROLES } from "../lib/constants/user";
import SuperUser from "../models/SuperUser";
import mongoose from "mongoose";
import StripeAccounts from "../classes/StripeAccounts";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { Socket } from "../classes/SocketIO";
import Notifications from "../models/Notifications";
import { sendMailtoUser } from "../lib/helpers/sendGridEmail";
import { MAIL_TYPES } from "../lib/constants/mailTypes";

const socket = new Socket()

class SuperUserService {
  async store(req) {
    const { userId, body } = req;
    const { description, website, socialInfo } = body;
    const userTableData = await User.findById(userId)
    const existingRequest = await SuperUser.findOne({ user: userId });

    if (
      (existingRequest &&
        existingRequest?.status === SUPER_USER_STATUS.PENDING) ||
      existingRequest?.status === SUPER_USER_STATUS.APPROVED
    ) {
      throw new Error(`Your request is already in ${existingRequest?.status}`);
    } else if (
      existingRequest &&
      existingRequest?.status === SUPER_USER_STATUS.REJECTED
    ) {
      existingRequest.status = SUPER_USER_STATUS.PENDING;
      existingRequest.approvedBy = null;
      await existingRequest.save();

      return existingRequest;
    }

    const superUser = new SuperUser({
      user: userId,
      status: SUPER_USER_STATUS.PENDING,
      description,
      website,
      socialInfo,
    });

    await superUser.save();

    const notification = {
      title: 'Super User Request Submitted.',
      user: userId,
      name: SOCKET_EVENT_TYPES.SUPERUSER_REQUEST,
      message: `Your request for super user has been submitted.`,
      from: '65291a4b64a424c209e8f360',
      receivers: [userId]
    }
    
    
    const notifications = new Notifications(notification);
    await notifications.save();

    socket.emit(SOCKET_EVENT_TYPES.SUPERUSER_REQUEST,{
          isNotification:true,
          userIds:[userId]
      })

    await sendMailtoUser(MAIL_TYPES.SUPER_USER_REQUEST_MAIL,{name:userTableData?.userName},userTableData?.email)


    return superUser;

  }

  async index(req) {
    const { userId } = req;
    const superUsers = await SuperUser.find({ user: userId });

    return superUsers;
  }

  async show(req) {
    const { userId } = req;
    const superUser = await SuperUser.findOne({ user: userId });

    if (!superUser) throw new Error("no approved request found");
    return superUser;
  }

  async update(req) {
    const { userId, body } = req;
    const { status, userToApprove } = body;

    const user = await User.findOne({ _id: userId });

    // if (user.role !== USER_ROLES.SUPER_ADMIN) {
    //   throw new Error("You role is not super admin");
    // }

    if (
      status !== SUPER_USER_STATUS.APPROVED &&
      status !== SUPER_USER_STATUS.PENDING &&
      status !== SUPER_USER_STATUS.REJECTED
    ) {
      throw new Error("invalid status value");
    }

    const sessions = await mongoose.startSession();
    await sessions.startTransaction();

    try {
      const updatedSuperUser = await SuperUser.findOneAndUpdate(
        { user: userToApprove },
        { approvedBy: userId, status },
        { new: true }
      );

      if (status == SUPER_USER_STATUS.APPROVED) {
        const account = await StripeAccounts.createConnectAccount()
        await User.findByIdAndUpdate(userToApprove,{
          $set:{
            stripeConnectAccountId:account.id
          }
        })
      }

      if (!updatedSuperUser)
        throw new Error("No request found against this user");

      await User.findOneAndUpdate(
        { _id: userToApprove },
        { role: status === SUPER_USER_STATUS.APPROVED ? USER_ROLES.SUERP_USER : USER_ROLES.USER },
        { new: true }
      );

      const notification = {
        title: 'Super User Request Approved.',
        user: userId,
        name: SOCKET_EVENT_TYPES.SUPERUSER_APPROVED,
        message: `Your request for super user has been approved.`,
        from: userId,
        receivers: [userToApprove],
        profileUrl: user?.profileUrl ?? null
      }
      
      
      const notifications = new Notifications(notification);
      await notifications.save();

      socket.emit(SOCKET_EVENT_TYPES.SUPERUSER_APPROVED,{
          isNotification:true,
          userIds:[userToApprove]
      })
      const toUser = await User?.findById(userToApprove)

      await sendMailtoUser(MAIL_TYPES.SUPER_USER_APPROVED_MAIL,{name:toUser?.userName},toUser?.email)

      await sessions.commitTransaction();

      return updatedSuperUser;
    } catch (err) {
      await sessions.abortTransaction();
      throw new Error(err.message || "server error");
    } finally {
      await sessions.endSession();
    }
  }
}

export default new SuperUserService();
