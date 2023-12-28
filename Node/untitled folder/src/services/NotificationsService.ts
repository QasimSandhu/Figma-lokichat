import { size } from "lodash";
import Notifications from "../models/Notifications";
import User from "../models/User";
import { sendMailtoUser } from "../lib/helpers/sendGridEmail";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { Socket } from "../classes/SocketIO";

const socket = new Socket()

class GoalsService {
  async index(req) {
    try {
    const { userId } = req;

    const notifications: any = await Notifications.find({receivers: { $in: userId }}).sort({ _id: -1 }).limit(20).populate({
      path: 'from',
      select: 'email profileUrl userName'
    });
    
    const newNot = notifications.map((i: any) => {
      const isRead = i._doc?.readBy?.find((it: any) => it == userId);
      return { ...i?._doc, isRead: isRead ? true : false };
    });

    return newNot;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async read(req) {
    const { userId } = req;
    const { id } = req.body;

    const notification: any = await Notifications.findByIdAndUpdate(id, {$addToSet: { readBy: userId }});
    return notification;
  }

  async store(req) {
    const { body, userId } = req;
    const { message, from, receivers, readBy } = body;

    const goal = new Notifications({
      user: userId,
      name:SOCKET_EVENT_TYPES.GOAL_NOTIFICATION,
      message,
      from,
      receivers,
      readBy: readBy || [],
    });

    await goal.save();

    socket.emit(SOCKET_EVENT_TYPES.GOAL_NOTIFICATION,{
      isNotification:true,
      userIds:[userId]
  })


    return goal;
  }

  async update(req) {
    const { body, userId } = req;
    const { notificationsList } = body;

    if (notificationsList === false) {
      return await User.findByIdAndUpdate(
        userId,
        { notificationsList: false },
        { new: true }
      );
    } else if (notificationsList === true) {
      return await User.findByIdAndUpdate(
        userId,
        { notificationsList: true },
        { new: true }
      );
    } else if (
      Array.isArray(notificationsList) &&
      size(notificationsList) > 0
    ) {
      return await User.findByIdAndUpdate(
        userId,
        { notificationsList: notificationsList },
        { new: true }
      );
    } else throw new Error("invalid user notifications list");
  }

  async destroy(req) {
    const { params } = req;
    const { notificationId } = params;

    return "";
  }

  async sendMail(req) {
    try {
      const { type, data, to } = req.body;
      await sendMailtoUser(type, data, to);
      return `Mail sent to ${to} on ${new Date()}`;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new GoalsService();
