import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import User from "../models/User";
import bcrypt from "bcryptjs";
import StorageUploader from "../classes/StorageUploader";
import { CONTENT_TYPE } from "../lib/constants/contentType";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import Audio from "../models/Audio";
import PhotoGeneration from "../models/PhotoGeneration";
import ChatGpt from "../models/Chat";
import Notebook from "../models/Notebook";
import Devices from "../models/Devices";

class ProfileService {
  async update(req) {
    const { userId } = req;
    const { userName, bio } = req.body;
    let uploadedUrl = "";
    const profileBufferId = uuid();
    if (req.file) {
      const imageBuffer = req.file.buffer;
      uploadedUrl = await StorageUploader.uploadToAzureStorage(
        profileBufferId,
        imageBuffer,
        CONTENT_TYPE.IMAGE
      );
    }
  
    const updateObject = { userName, bio };
    if (uploadedUrl) {
      //@ts-ignore
      updateObject.profileUrl = uploadedUrl;
    }
  
    try {
      const user = await User.findById(userId);
      
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
      const updatedUser = await user.save();
      console.log(updatedUser, "updatedUser");
  
      return { ...ObjectManipulator.distruct(updatedUser) };
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle the error appropriately, such as returning an error response
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { userId } = req;
      const { oldPassword, newPassword, confirmPassword } = req.body;
  
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        throw new Error("Could not find User with this Id");
      }
  
      if (user.password) {
        const isPasswordVerified = await bcrypt.compare(
          oldPassword,
          user.password
        );
  
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
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedNewPassword } }
      );
      return { ...ObjectManipulator.distruct(user) };
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  }

  async destroy(req) {
    const { userId } = req;
    const { password } = req.body;

    if (!userId) throw new Error("User ID is required.");

    const user = await User.findById(userId);

    if (!user) throw new Error("No user found with this ID.");

    if ((!user.gmailProvider && !user.gmailProviderId) || (!user.appleProvider && !user.appleProviderId)) {
      const isPasswordValid = await bcrypt.compare(password || "", user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password. User authentication failed.");
      }
    }
    const deletedDevices: any = await Devices.deleteMany({ user: userId });
    // Instead of physically deleting the user, mark them as deleted
    await User.findByIdAndUpdate(userId, { isDeleted: true, isVerified: false, });
    return { message: "User marked as deleted." };
  }
  async destroyUser(req) {
    const { userId } = req;
    const { password } = req.query;
  
    if (!userId) throw new Error("User ID is required.");
  
    let session;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) throw new Error("No user found with this ID.");
  
      if(!user.gmailProviderId && !user.appleProviderId){
        if (user.password) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password. User authentication failed.");
          }
        }
      }
      
      session = await mongoose.startSession();
      session.startTransaction();
      await User.findByIdAndDelete(userId);
      await Audio.deleteMany({ user:userId });
      await PhotoGeneration.deleteMany({ user:userId });
      await ChatGpt.deleteMany({ user:userId });
      await Notebook.deleteMany({ user:userId });
      await session.commitTransaction();
      session.endSession();
  
      return { message: "User deleted." };
    } catch (error) {
      console.error(error);
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw error;
    }
  }
  async getUserProfile (req){
    const { userId } = req;
    try{
const user=await User.findById(userId)
console.log(user,"user");
return {...ObjectManipulator.distruct(user)}
    }
    catch(error){
console.log(error,"error");

    }
  }

  async updateUserName(req) {

    const {
      userName
    } = req.body;

    const { userId } = req;

    const user: any = await User.findById(userId);

    if (!user) {
      throw new Error("user not found")
    };

    user.userName = userName;
    await user.save();

    return user;

  }
}

export default new ProfileService();
