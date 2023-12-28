"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Audio_1 = __importDefault(require("../models/Audio"));
const moment_1 = __importDefault(require("moment"));
const User_1 = __importDefault(require("../models/User"));
const sendGridEmail_1 = require("../lib/helpers/sendGridEmail");
const mailTypes_1 = require("../lib/constants/mailTypes");
const SocketIO_1 = require("../classes/SocketIO");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const notificationsTypes_1 = require("../lib/constants/notificationsTypes");
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const socket = new SocketIO_1.Socket();
class AudioService {
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, userId } = req;
                let { date, page, resPerPage } = query;
                page = page !== null && page !== void 0 ? page : 1;
                resPerPage = resPerPage !== null && resPerPage !== void 0 ? resPerPage : 12;
                const currentDate = new Date();
                const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDayOfCurrentMonth = (0, moment_1.default)().endOf("month");
                const queryOjb = [{ user: userId }];
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
                }
                else {
                    queryOjb.push({
                        createdAt: {
                            $gte: firstDayOfCurrentMonth,
                            $lte: lastDayOfCurrentMonth.toISOString(),
                        },
                    });
                }
                const [audios, totalAudios] = yield Promise.all([
                    Audio_1.default.find({
                        $and: [...queryOjb],
                    })
                        .sort({ _id: -1 })
                        .skip(resPerPage * page - resPerPage)
                        .limit(resPerPage)
                        .populate("sharedTo", "email userName profileUrl"),
                    Audio_1.default.find({
                        $and: [...queryOjb],
                    }).countDocuments(),
                ]);
                return { audios, totalAudios };
            }
            catch (error) {
                throw error;
            }
        });
    }
    sharedAudioLibrary(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, userId } = req;
                let { date, page, resPerPage } = query;
                page = page !== null && page !== void 0 ? page : 1;
                resPerPage = resPerPage !== null && resPerPage !== void 0 ? resPerPage : 12;
                const queryObj = [
                    {
                        sharedTo: userId, // Audios shared with the user
                    },
                ];
                const currentDate = new Date();
                const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                if (date && date !== "") {
                    const newDate = new Date(date);
                    newDate.setUTCHours(0, 0, 0, 0);
                    const tomorrow = new Date(newDate);
                    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
                    // Check if the provided date falls within the current month
                    if (newDate >= firstDayOfCurrentMonth &&
                        newDate <= lastDayOfCurrentMonth) {
                        queryObj.push({
                            createdAt: {
                                $gte: newDate.toISOString(),
                                $lt: tomorrow.toISOString(),
                            },
                        });
                    }
                }
                else {
                    queryObj.push({
                        createdAt: {
                            $gte: firstDayOfCurrentMonth,
                            $lte: lastDayOfCurrentMonth,
                        },
                    });
                }
                const [audios, totalAudios] = yield Promise.all([
                    Audio_1.default.find({
                        $and: [...queryObj],
                    })
                        .sort({ _id: -1 })
                        .skip(resPerPage * page - resPerPage)
                        .limit(resPerPage)
                        .populate("sharedTo", "email userName profileUrl")
                        .populate("sharedFrom", "email userName profileUrl"),
                    Audio_1.default.find({
                        $and: [...queryObj],
                    }).countDocuments(),
                ]);
                return { audios, totalAudios };
            }
            catch (error) {
                throw error;
            }
        });
    }
    sharedAudioLibraryPrevMonth(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, userId } = req;
                let { date, page, resPerPage } = query;
                page = page !== null && page !== void 0 ? page : 1;
                resPerPage = resPerPage !== null && resPerPage !== void 0 ? resPerPage : 12;
                const queryObj = [
                    {
                        sharedTo: userId, // Audios shared with the user
                    },
                ];
                const currentDate = new Date();
                const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
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
                }
                else {
                    queryObj.push({
                        //@ts-ignore
                        createdAt: {
                            $gte: previousMonth,
                            $lte: lastDayOfPreviousMonth,
                        },
                    });
                }
                const [audios, totalAudios] = yield Promise.all([
                    Audio_1.default.find({
                        $and: [...queryObj],
                    })
                        .sort({ _id: -1 })
                        .skip(resPerPage * page - resPerPage)
                        .limit(resPerPage)
                        .populate("sharedTo", "email userName profileUrl")
                        .populate("sharedFrom", "email userName profileUrl"),
                    Audio_1.default.find({
                        $and: [...queryObj],
                    }).countDocuments(),
                ]);
                console.log(audios, "audios");
                return { audios, totalAudios };
            }
            catch (error) {
                throw error;
            }
        });
    }
    indexPreviousMonth(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, userId } = req;
                let { date, page, resPerPage } = query;
                page = page !== null && page !== void 0 ? page : 1;
                resPerPage = resPerPage !== null && resPerPage !== void 0 ? resPerPage : 12;
                const currentDate = new Date();
                const queryObj = [{ user: userId }];
                const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
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
                }
                else {
                    queryObj.push({
                        //@ts-ignore
                        createdAt: {
                            $gte: previousMonth,
                            $lte: lastDayOfPreviousMonth,
                        },
                    });
                }
                const [audios, totalAudios] = yield Promise.all([
                    Audio_1.default.find({
                        $and: queryObj,
                    })
                        .sort({ _id: -1 })
                        .skip(resPerPage * (page - 1))
                        .limit(resPerPage)
                        .populate("sharedTo", "email userName profileUrl"),
                    Audio_1.default.countDocuments({
                        $and: queryObj,
                    }),
                ]);
                return { audios, totalAudios };
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { audioId, text } = body;
            const updatedAudio = yield Audio_1.default.findByIdAndUpdate(audioId, { editedText: text }, { new: true });
            if (!updatedAudio)
                throw new Error("Could not find library with this Id");
            yield updatedAudio.populate("sharedTo", "email userName profileUrl");
            return { updatedAudio };
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            if (!Id)
                throw new Error("audioId is required to delete the audio");
            const deletedAudio = yield Audio_1.default.findByIdAndDelete(Id);
            if (!deletedAudio)
                throw new Error("No audio found with this id.");
            return deletedAudio;
        });
    }
    addSharedAudio(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { audioId, ids } = req.body;
            try {
                const reqUser = yield User_1.default.findById(userId);
                const audio = yield Audio_1.default.findById(audioId);
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
                const users = yield User_1.default.find({ _id: { $in: ids } });
                audio.sharedTo = users.map((user) => user._id); // Extract user IDs
                audio.sharedFrom = userId;
                const updatedAudio = yield audio.save(); // Save the updated audio
                // You can now use a new query to populate the sharedTo field
                const populatedAudio = yield Audio_1.default.findById(updatedAudio._id).populate("sharedTo user", "email userName profileUrl");
                try {
                    const emails = yield Promise.all(users.map((i) => __awaiter(this, void 0, void 0, function* () {
                        yield (0, sendGridEmail_1.sendMailtoUser)(mailTypes_1.MAIL_TYPES.AUDIO_SHARED_MAIL, {}, i === null || i === void 0 ? void 0 : i.email);
                        return true;
                    })));
                }
                catch (error) {
                    console.log(error);
                }
                const notification = {
                    title: 'Audio shared.',
                    user: userId,
                    name: notificationsTypes_1.SOCKET_EVENT_TYPES.AUDIO_SHARE,
                    message: `${(_b = (_a = reqUser === null || reqUser === void 0 ? void 0 : reqUser.userName) !== null && _a !== void 0 ? _a : reqUser === null || reqUser === void 0 ? void 0 : reqUser.email) !== null && _b !== void 0 ? _b : 'Someone'} share audio with you`,
                    from: userId,
                    receivers: users.map((user) => user._id),
                    profileUrl: (_d = (_c = populatedAudio === null || populatedAudio === void 0 ? void 0 : populatedAudio.user) === null || _c === void 0 ? void 0 : _c.profileUrl) !== null && _d !== void 0 ? _d : null
                };
                const notifications = new Notifications_1.default(notification);
                yield notifications.save();
                socket.emit(notificationsTypes_1.SOCKET_EVENT_TYPES.AUDIO_SHARE, {
                    isNotification: true,
                    userIds: [userId, users.map((user) => user._id)]
                });
                return { updatedAudio: populatedAudio };
            }
            catch (error) {
                console.log(error, "error");
                throw new Error("Error sharing audio");
            }
        });
    }
    removeSharedAudio(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            const { userId } = req;
            const audio = yield Audio_1.default.findById(Id);
            if (!audio)
                throw new Error("Audio not found");
            // Check if the user is in the sharedTo array
            if (!audio.sharedTo.includes(userId)) {
                throw new Error("User is not in the sharedTo list for this audio");
            }
            audio.sharedTo = audio.sharedTo.filter((sharedUserId) => sharedUserId.toString() !== userId.toString());
            yield Audio_1.default.findByIdAndUpdate(Id, audio, { new: true });
            return { message: "User removed from sharedTo list successfully" };
        });
    }
    getAllUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            let { page, resPerPage, search } = req.query;
            page = page !== null && page !== void 0 ? page : 1;
            resPerPage = resPerPage !== null && resPerPage !== void 0 ? resPerPage : 12;
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
                const [users, totalUsers] = yield Promise.all([
                    User_1.default.find(userSearchCriteria)
                        .select('userName email profileUrl')
                        .sort({ _id: -1 })
                        .skip(resPerPage * (page - 1))
                        .limit(resPerPage),
                    User_1.default.countDocuments(userSearchCriteria),
                ]);
                return { users, totalUsers,
                    currentPage: Number(page),
                    pages: Math.ceil(totalUsers / resPerPage),
                    totalRecords: Number(totalUsers),
                    perPage: Number(resPerPage) };
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching users");
            }
        });
    }
    getUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const user = yield User_1.default.findById(userId);
            return Object.assign({}, ObjectDestructurer_1.default.distruct(user));
        });
    }
}
exports.default = new AudioService();
//# sourceMappingURL=AudioLibraryService.js.map