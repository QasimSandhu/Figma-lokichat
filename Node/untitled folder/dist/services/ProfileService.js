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
const ObjectDestructurer_1 = __importDefault(require("../lib/helpers/ObjectDestructurer"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const StorageUploader_1 = __importDefault(require("../classes/StorageUploader"));
const contentType_1 = require("../lib/constants/contentType");
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
const Audio_1 = __importDefault(require("../models/Audio"));
const PhotoGeneration_1 = __importDefault(require("../models/PhotoGeneration"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Notebook_1 = __importDefault(require("../models/Notebook"));
const Devices_1 = __importDefault(require("../models/Devices"));
class ProfileService {
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { userName, bio } = req.body;
            let uploadedUrl = "";
            const profileBufferId = (0, uuid_1.v4)();
            if (req.file) {
                const imageBuffer = req.file.buffer;
                uploadedUrl = yield StorageUploader_1.default.uploadToAzureStorage(profileBufferId, imageBuffer, contentType_1.CONTENT_TYPE.IMAGE);
            }
            const updateObject = { userName, bio };
            if (uploadedUrl) {
                //@ts-ignore
                updateObject.profileUrl = uploadedUrl;
            }
            try {
                const user = yield User_1.default.findById(userId);
                if (!user) {
                    throw new Error("Could not find User with this Id");
                }
                // Update the properties of the user object
                user.userName = updateObject.userName;
                user.bio = updateObject.bio;
                if (uploadedUrl) {
                    //@ts-ignore
                    user.profileUrl = updateObject.profileUrl;
                }
                // Save the updated user object
                const updatedUser = yield user.save();
                console.log(updatedUser, "updatedUser");
                return Object.assign({}, ObjectDestructurer_1.default.distruct(updatedUser));
            }
            catch (error) {
                console.error("Error updating profile:", error);
                // Handle the error appropriately, such as returning an error response
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const { oldPassword, newPassword, confirmPassword } = req.body;
                const user = yield User_1.default.findOne({ _id: userId });
                if (!user) {
                    throw new Error("Could not find User with this Id");
                }
                if (user.password) {
                    const isPasswordVerified = yield bcryptjs_1.default.compare(oldPassword, user.password);
                    if (!isPasswordVerified) {
                        throw new Error("Current password not matched");
                    }
                }
                if (newPassword === oldPassword) {
                    throw new Error("New Password cannot be the same as the Current Password");
                }
                if (newPassword !== confirmPassword) {
                    throw new Error("New Password and Confirm Password not match");
                }
                // Hash the new password
                const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                // Update the user's password
                yield User_1.default.updateOne({ _id: user._id }, { $set: { password: hashedNewPassword } });
                return Object.assign({}, ObjectDestructurer_1.default.distruct(user));
            }
            catch (error) {
                console.log(error, "error");
                throw error;
            }
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { password } = req.body;
            if (!userId)
                throw new Error("User ID is required.");
            const user = yield User_1.default.findById(userId);
            if (!user)
                throw new Error("No user found with this ID.");
            if ((!user.gmailProvider && !user.gmailProviderId) || (!user.appleProvider && !user.appleProviderId)) {
                const isPasswordValid = yield bcryptjs_1.default.compare(password || "", user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid password. User authentication failed.");
                }
            }
            const deletedDevices = yield Devices_1.default.deleteMany({ user: userId });
            // Instead of physically deleting the user, mark them as deleted
            yield User_1.default.findByIdAndUpdate(userId, { isDeleted: true, isVerified: false, });
            return { message: "User marked as deleted." };
        });
    }
    destroyUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { password } = req.query;
            if (!userId)
                throw new Error("User ID is required.");
            let session;
            try {
                const user = yield User_1.default.findById(userId);
                if (!user)
                    throw new Error("No user found with this ID.");
                if (!user.gmailProviderId && !user.appleProviderId) {
                    if (user.password) {
                        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                        if (!isPasswordValid) {
                            throw new Error("Invalid password. User authentication failed.");
                        }
                    }
                }
                session = yield mongoose_1.default.startSession();
                session.startTransaction();
                yield User_1.default.findByIdAndDelete(userId);
                yield Audio_1.default.deleteMany({ user: userId });
                yield PhotoGeneration_1.default.deleteMany({ user: userId });
                yield Chat_1.default.deleteMany({ user: userId });
                yield Notebook_1.default.deleteMany({ user: userId });
                yield session.commitTransaction();
                session.endSession();
                return { message: "User deleted." };
            }
            catch (error) {
                console.error(error);
                if (session) {
                    yield session.abortTransaction();
                    session.endSession();
                }
                throw error;
            }
        });
    }
    getUserProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            try {
                const user = yield User_1.default.findById(userId);
                console.log(user, "user");
                return Object.assign({}, ObjectDestructurer_1.default.distruct(user));
            }
            catch (error) {
                console.log(error, "error");
            }
        });
    }
    updateUserName(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName } = req.body;
            const { userId } = req;
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new Error("user not found");
            }
            ;
            user.userName = userName;
            yield user.save();
            return user;
        });
    }
}
exports.default = new ProfileService();
//# sourceMappingURL=ProfileService.js.map