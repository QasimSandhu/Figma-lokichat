import Audio from "../models/Audio";
import moment from "moment";
import User from "../models/User";
import { sendMailtoUser } from "../lib/helpers/sendGridEmail";
import { MAIL_TYPES } from "../lib/constants/mailTypes";
import { Socket } from "../classes/SocketIO";
import Notifications from "../models/Notifications";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";

const socket = new Socket()

class AudioService {
  async index(req) {
    try {
      const { query, userId } = req;
      let { date, page, resPerPage } = query;

      page = page ?? 1;
      resPerPage = resPerPage ?? 12;

      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfCurrentMonth = moment().endOf("month");

      const queryOjb: any = [{ user: userId }];

      if (date && date !== "") {
        const newDate = new Date(date);
        newDate.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(newDate);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        queryOjb.push({
          createdAt: {
            $gte: newDate.toISOString(),
            $lt: tomorrow.toISOString(),
          },
        });
      } else {
        queryOjb.push({
          createdAt: {
            $gte: firstDayOfCurrentMonth,
            $lte: lastDayOfCurrentMonth.toISOString(),
          },
        });
      }

      const [audios, totalAudios] = await Promise.all([
        Audio.find({
          $and: [...queryOjb],
        })
          .sort({ _id: -1 })
          .skip(resPerPage * page - resPerPage)
          .limit(resPerPage)
          .populate("sharedTo", "email userName profileUrl"),

        Audio.find({
          $and: [...queryOjb],
        }).countDocuments(),
      ]);

      return { audios, totalAudios };
    } catch (error) {
      throw error;
    }
  }

  async sharedAudioLibrary(req) {
    try {
      const { query, userId } = req;
      let { date, page, resPerPage } = query;

      page = page ?? 1;
      resPerPage = resPerPage ?? 12;

      const queryObj: any = [
        {
          sharedTo: userId, // Audios shared with the user
        },
      ];
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      if (date && date !== "") {
        const newDate = new Date(date);
        newDate.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(newDate);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        // Check if the provided date falls within the current month
        if (
          newDate >= firstDayOfCurrentMonth &&
          newDate <= lastDayOfCurrentMonth
        ) {
          queryObj.push({
            createdAt: {
              $gte: newDate.toISOString(),
              $lt: tomorrow.toISOString(),
            },
          });
        }
      } else {
        queryObj.push({
          createdAt: {
            $gte: firstDayOfCurrentMonth,
            $lte: lastDayOfCurrentMonth,
          },
        });
      }
      const [audios, totalAudios] = await Promise.all([
        Audio.find({
          $and: [...queryObj],
        })
          .sort({ _id: -1 })
          .skip(resPerPage * page - resPerPage)
          .limit(resPerPage)
          .populate("sharedTo", "email userName profileUrl")
          .populate("sharedFrom", "email userName profileUrl"),

        Audio.find({
          $and: [...queryObj],
        }).countDocuments(),
      ]);

      return { audios, totalAudios };
    } catch (error) {
      throw error;
    }
  }

  async sharedAudioLibraryPrevMonth(req) {
    try {
      const { query, userId } = req;
      let { date, page, resPerPage } = query;

      page = page ?? 1;
      resPerPage = resPerPage ?? 12;

      const queryObj: any = [
        {
          sharedTo: userId, // Audios shared with the user
        },
      ];
      const currentDate = new Date();

      const previousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );

      const lastDayOfPreviousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );

      if (date && date !== "") {
        const newDate = new Date(date);
        newDate.setUTCDate(newDate.getUTCDate() + 30);

        const endDate = new Date(newDate);
        endDate.setUTCDate(endDate.getUTCDate() + 60);

        queryObj.push({
          //@ts-ignore
          createdAt: {
            $gte: newDate,
            $lt: endDate,
          },
        });
      } else {
        queryObj.push({
          //@ts-ignore
          createdAt: {
            $gte: previousMonth,
            $lte: lastDayOfPreviousMonth,
          },
        });
      }
      const [audios, totalAudios] = await Promise.all([
        Audio.find({
          $and: [...queryObj],
        })
          .sort({ _id: -1 })
          .skip(resPerPage * page - resPerPage)
          .limit(resPerPage)
          .populate("sharedTo", "email userName profileUrl")
          .populate("sharedFrom", "email userName profileUrl"),

        Audio.find({
          $and: [...queryObj],
        }).countDocuments(),
      ]);

      console.log(audios, "audios");

      return { audios, totalAudios };
    } catch (error) {
      throw error;
    }
  }

  async indexPreviousMonth(req) {
    try {
      const { query, userId } = req;
      let { date, page, resPerPage } = query;

      page = page ?? 1;
      resPerPage = resPerPage ?? 12;

      const currentDate = new Date();

      const queryObj = [{ user: userId }];

      const previousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );

      const lastDayOfPreviousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );

      if (date && date !== "") {
        const newDate = new Date(date);
        newDate.setUTCDate(newDate.getUTCDate() + 30);

        const endDate = new Date(newDate);
        endDate.setUTCDate(endDate.getUTCDate() + 60);

        queryObj.push({
          //@ts-ignore
          createdAt: {
            $gte: newDate,
            $lt: endDate,
          },
        });
      } else {
        queryObj.push({
          //@ts-ignore
          createdAt: {
            $gte: previousMonth,
            $lte: lastDayOfPreviousMonth,
          },
        });
      }

      const [audios, totalAudios] = await Promise.all([
        Audio.find({
          $and: queryObj,
        })
          .sort({ _id: -1 })
          .skip(resPerPage * (page - 1))
          .limit(resPerPage)
          .populate("sharedTo", "email userName profileUrl"),

        Audio.countDocuments({
          $and: queryObj,
        }),
      ]);

      return { audios, totalAudios };
    } catch (error) {
      throw error;
    }
  }

  async update(req) {
    const { body } = req;

    const { audioId, text } = body;

    const updatedAudio = await Audio.findByIdAndUpdate(
      audioId,
      { editedText: text },
      { new: true }
    );
    if (!updatedAudio) throw new Error("Could not find library with this Id");
    await updatedAudio.populate("sharedTo", "email userName profileUrl");
    return { updatedAudio };
  }

  async destroy(req) {
    const { Id } = req.params;

    if (!Id) throw new Error("audioId is required to delete the audio");

    const deletedAudio = await Audio.findByIdAndDelete(Id);

    if (!deletedAudio) throw new Error("No audio found with this id.");

    return deletedAudio;
  }

  async addSharedAudio(req) {
    const { userId } = req;
    const { audioId, ids } = req.body;

    try {
      const reqUser = await User.findById(userId)
      const audio = await Audio.findById(audioId);

      if (!audio) {
        throw new Error("Audio not found");
      }

      if (audio.user.toString() !== userId) {
        throw new Error("You do not have permission to share this audio");
      }

      if (ids.length === 0) {
        throw new Error("No user IDs provided for sharing");
      }

      // Find users with valid user IDs in your records
      const users = await User.find({ _id: { $in: ids } });

      audio.sharedTo = users.map((user) => user._id); // Extract user IDs

      audio.sharedFrom = userId;

      const updatedAudio = await audio.save(); // Save the updated audio

      // You can now use a new query to populate the sharedTo field
      const populatedAudio = await Audio.findById(updatedAudio._id).populate(
        "sharedTo user",
        "email userName profileUrl"
      );

      try {
        const emails = await Promise.all(users.map(async(i)=>{
          await sendMailtoUser(MAIL_TYPES.AUDIO_SHARED_MAIL,{},i?.email)
          return true;
        }))
      } catch (error) {
        console.log(error);
      }
      
      const notification = {
        title: 'Audio shared.',
        user:userId,
        name: SOCKET_EVENT_TYPES.AUDIO_SHARE,
        message: `${reqUser?.userName ?? reqUser?.email ?? 'Someone'} share audio with you`,
        from: userId,
        receivers: users.map((user) => user._id),
        profileUrl: populatedAudio?.user?.profileUrl ?? null
      }

      const notifications = new Notifications(notification);
      await notifications.save();
      socket.emit(SOCKET_EVENT_TYPES.AUDIO_SHARE,{
        isNotification:true,
        userIds:[userId,users.map((user) => user._id)]
      })

      return { updatedAudio: populatedAudio };
    } catch (error) {
      console.log(error, "error");
      throw new Error("Error sharing audio");
    }
  }
  async removeSharedAudio(req) {
    const { Id } = req.params;
    const { userId } = req;

    const audio = await Audio.findById(Id);

    if (!audio) throw new Error("Audio not found");

    // Check if the user is in the sharedTo array
    if (!audio.sharedTo.includes(userId)) {
      throw new Error("User is not in the sharedTo list for this audio");
    }

    audio.sharedTo = audio.sharedTo.filter(
      (sharedUserId) => sharedUserId.toString() !== userId.toString()
    );
    await Audio.findByIdAndUpdate(Id, audio, { new: true });
    return { message: "User removed from sharedTo list successfully" };
  }

  async getAllUsers(req) {
    const { userId } = req;
    let { page, resPerPage, search } = req.query;
    page = page ?? 1;
    resPerPage = resPerPage ?? 12;
    const userSearchCriteria = {
      _id: { $ne: userId }
    };
  
    if (search && search.trim() !== '') {
      userSearchCriteria['$or'] = [
        { userName: { $regex: new RegExp(search, 'i') } },
        { email: { $regex: new RegExp(search, 'i') } }
      ];
    }
  
    try {
      const [users, totalUsers] = await Promise.all([
        User.find(userSearchCriteria)
          .select('userName email profileUrl')
          .sort({ _id: -1 })
          .skip(resPerPage * (page - 1))
          .limit(resPerPage),
  
        User.countDocuments(userSearchCriteria),
      ]);
      return { users, totalUsers,
      currentPage: Number(page),
            pages: Math.ceil(totalUsers / resPerPage),
            totalRecords: Number(totalUsers),
            perPage: Number(resPerPage) };
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching users");
    }
  }

  async getUser(req) {
    const { userId } = req;
    const user = await User.findById(userId);
    
    return {...ObjectManipulator.distruct(user)};
  }
}

export default new AudioService();
