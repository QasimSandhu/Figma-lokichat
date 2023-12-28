import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/config";
import ObjectManipulator from "../lib/helpers/ObjectDestructurer";
import { generateOTP } from "../lib/helpers/generateOtp";
import { sendEmail } from "../lib/helpers/sendMail";
import axios from "axios";
import CustomError from "../middleware/CustomError";
import { generateRefreshToken } from "../lib/helpers/generateToken";
import RefreshToken from "../models/RefreshToken";
import DevicesServices from "./DevicesServices";
import Compains from "../models/Compain";
import { size } from "lodash";
import { SOCIAL_AUTH, USER_ROLES } from "../lib/constants/user";
import { SOCKET_EVENT_TYPES } from "../lib/constants/notificationsTypes";
import { Socket } from "../classes/SocketIO";
import Notifications from "../models/Notifications";
import { sendMailtoUser } from "../lib/helpers/sendGridEmail";
import { MAIL_TYPES } from "../lib/constants/mailTypes";
import { generateRandomString } from "../lib/helpers/utils";
import InvitedSuperUser from "../models/invitedSuperUser";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const socket = new Socket();

class AuthService {
  async login(req) {
    try {
      const {
        email,
        password,
        os,
        browserName,
        browserVersion,
        ipAddress,
        isMobile,
        mobileId,
        mobileName,
        type
      } = req;
      if (isMobile) {
        if (!mobileId || !mobileName) {
          throw new CustomError("Device information is required to login", 401);
        }
      }

      const socialUser: any = await User.findOne({
        email: email?.toLowerCase(),
        isVerified: true,
      });
      if (socialUser && (socialUser.gmailProviderId || socialUser.appleProviderId) && !socialUser.password)
        throw new CustomError("Account already exists with a different login method. Please sign in using the original method.", 401);

      // Find user by email
      const user: any = await User.findOne({
        email: email?.toLowerCase(),
        isVerified: true
      });
      if (!user) throw new CustomError("User does not exist with this email address.", 401);
      if (user && !user?.isReferralVerified && !type) {
        return user
      }
      // if(user && !user?.userName && !type){
      //   return user;
      // }
      //N6TTYJIME
      
      if (user && user.isDeleted) throw new Error("User does not exists");

      if (!user.isVerified)
        throw new CustomError("Your account is not verified yet.", 403);

      // Compare password hashes
      const match = await bcrypt.compare(password, user.password);

      if (!match) throw new CustomError("Invalid email or password",401);
      if (type === "referral") {
        user.isReferralVerified = true
      }
      await user.save();

      // save logged in device information
      const data: any = {
        userId: user._id,
        os,
        ipAddress,
        browserName,
        browserVersion,
        isMobile,
        mobileId,
        mobileName,
      };
      const savedDevice = await DevicesServices.saveDeviceIntoDB(data, false);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          deviceId: savedDevice._id,
          role: user.role || USER_ROLES.USER,
        },
        config.jwtSecretKey,
        { expiresIn: config.jwtTokenExpiration }
      );

      const generatedRefreshToken = await this.saveRefreshToken(user);

      return {
        ...ObjectManipulator.distruct(user),
        token,
        refreshToken: generatedRefreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async saveRefreshToken(user: any) {
    let token;
    const generatedRefreshToken = await generateRefreshToken();

    const existingRefreshToken: any = RefreshToken.findOne({ user: user._id });

    if (existingRefreshToken) {
      const refreshToken = new RefreshToken({
        user: user._id,
        token: generatedRefreshToken,
      });
      refreshToken.save();
      token = refreshToken.token;
    } else {
      existingRefreshToken.token = generatedRefreshToken;
      await existingRefreshToken.save();
      token = existingRefreshToken.token;
    }
    return token;
  }

  async register(req) {

    try {
      const { userName, email, password, referalInvite, campainId } = req;

      if (!userName || !email) {
        throw new Error("Username and Email both are required");
      }
      const checkUserIsInvited = await InvitedSuperUser.findOne({ email: email });
      // if(!checkUserIsInvited){
      //   throw new Error("Please use valid email")
      // }
      let referringUser;
      let compaign;
      let referringUserFromAdmin;

      if (referalInvite) {
        // Find the referring user by their referral code
        referringUser = await User.findOne({ referralCode: referalInvite });
        referringUserFromAdmin = await InvitedSuperUser.findOne({ invitationCode: referalInvite });

        // if (!referringUser || !referringUserFromAdmin) {
        //   throw new Error("Referral code not found.");
        // }
      }
      if (campainId) {
        // Find the comapign  by their comapign name
        compaign = await Compains.findOne({ _id: campainId });
        if (!compaign) throw new Error("Compaign not found.");
      }
      const user: any = await User.findOne({
        email: email?.toLowerCase(),
        isVerified: true
      });

      if (user) {
        if (user?.isDeleted === false && user.isVerified === true && !user.password) {
          throw new Error("Account already exists with a different login method. Please sign in using the original method.");
        } else if (user?.isDeleted === false && user.isVerified === true) {
          throw new Error("You are already registered");
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const customer = await stripe.customers.create({
        email: email?.toLowerCase(),
        name: userName,
        description: "Loki Chat",
      });

      const otp = generateOTP(); // Implement the function to generate OTP
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires after 10 minutes
      const referralCode = generateRandomString(9);
      let updatedUser: any;
      if (!user) {
        const newUser = new User({
          userName,
          email: email.toLowerCase(),
          otpExpiresAt,
          otp: Number(otp),
          password: hashedPassword,
          stripeId: customer?.id,
          referralCode: referralCode,
          invitedReferralCode: referalInvite,
          campaignId: compaign?._id,

        });
        if (referringUser) {
          referringUser.invitedUsers.push(newUser._id);
          await referringUser.save();
        }
        if (referringUserFromAdmin) {
          newUser.role = 'super-user'
        }

        updatedUser = await newUser.save();
      } else if (user) {
        if (user?.isDeleted) user.isDeleted = false;
        user.provider = null;
        user.providerId = null;
        user.userName = userName;
        user.otpExpiresAt = otpExpiresAt;
        user.otp = Number(otp);
        user.password = hashedPassword;
        user.stripeId = customer?.id;
        user.referralCode = referralCode;
        user.campaignId = compaign?._id || null;
        updatedUser = await user.save();
      }

      if (compaign) {
        const rcUser = compaign?._doc?.creator ?? compaign?.creator;
        const notification = {
          title: "Campaign User Registered",
          user: rcUser,
          name: SOCKET_EVENT_TYPES.CAMPAIGN_INVITE,
          message: `${userName} has singed up with your campaign.`,
          from: updatedUser._id ?? updatedUser?._doc?._id,
          receivers: [rcUser],
          profileUrl: updatedUser.profileUrl ?? updatedUser?._doc?.profileUrl ?? null
        };

        const notifications = new Notifications(notification);
        await notifications.save();

        socket.emit(SOCKET_EVENT_TYPES.CAMPAIGN_INVITE,{
          isNotification:true,
          userIds:[rcUser]
        });
       
      } else if (referalInvite) {
        const rcUser = referringUser?._doc?._id ?? referringUser?._id;
        const notification = {
          title: "Invitation Accepted",
          user: rcUser,
          name: SOCKET_EVENT_TYPES.REFFERAL_INVITE,
          message: `${userName} has singed up with your invitation link.`,
          from: updatedUser._id ?? updatedUser?._doc?._id,
          receivers: [rcUser],
        };
        const notifications = new Notifications(notification);
        await notifications.save();
        socket.emit(SOCKET_EVENT_TYPES.REFFERAL_INVITE,{
          isNotification:true,
          userIds:[rcUser]
        });
        
      }

      await sendMailtoUser(
        MAIL_TYPES.OTP_MAIL,
        { name: userName, email: email, otp: otp },
        email
      );

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(req) {
    try {
      const { email, otp } = req;

      // Find user by email
      const user: any = await User.findOne({
        email: email?.toLowerCase(),
        password: { $ne: null }
      });

      if (!user) return false;

      // Check if the OTP has expired
      if (new Date() > user.otpExpiresAt) throw new Error("Otp has expired!");

      // Check if the provided OTP matches the saved OTP
      if (otp != user.otp) throw new Error("Invalid OTP");

      // If OTP is valid, mark it as verified
      user.isOtpVerified = true;
      user.isVerified = true;
      await user.save();

      await sendMailtoUser(
        MAIL_TYPES.WELCOME_MAIL,
        { name: user?.userName },
        email
      );

      return { ...ObjectManipulator.distruct(user) };
    } catch (err) {
      throw err;
    }
  }

  async verifyReferralCode(req) {
    try {

      const { email,
        appleProviderId,
        gmailProviderId,
        referralCode,
        os,
        browserName,
        browserVersion,
        ipAddress,
        isMobile,
        mobileId,
        mobileName,
        type
      } = req;

      let user:any = null;
      if(appleProviderId){
        user = await User.findOne({ appleProviderId: appleProviderId });
      } else if(gmailProviderId){
        user = await User.findOne({ gmailProviderId: gmailProviderId });
      } else if(email){
        user = await User.findOne({ email: email?.toLowerCase() });
      }

      const comapaign: any = await Compains.findOne({ referralCode: referralCode });
      const userReferral: any = await User.findOne({ referralCode: referralCode });


      const invitedBByAdmin: any = await InvitedSuperUser.findOne({ invitationCode: referralCode });
      if (!user) {
        throw new Error("user not found")
      };

      if (!comapaign && !invitedBByAdmin && !userReferral) throw new Error("Invalid Referral code");
      user.isReferralVerified = true;
      user.invitedReferralCode = referralCode
      if(comapaign) user.campaignId = comapaign._id ?? comapaign?._doc?._id
      
      await user.save();

      if (userReferral && !userReferral.invitedUsers.includes(user._id)) {
        userReferral.invitedUsers.push(user._id);
        //userReferral.subscribedUser.push(user._id);
        userReferral.inviteUserCount = userReferral.invitedUsers.length;
        await userReferral.save();
      }

      const data: any = {
        userId: user._id,
        os,
        ipAddress,
        browserName,
        browserVersion,
        isMobile,
        mobileId,
        mobileName,
      };
      const savedDevice = await DevicesServices.saveDeviceIntoDB(data, false);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          deviceId: savedDevice._id,
          role: user.role || USER_ROLES.USER,
        },
        config.jwtSecretKey,
        { expiresIn: config.jwtTokenExpiration }
      );
      const generatedRefreshToken = await this.saveRefreshToken(user);
      // return { ...ObjectManipulator.distruct(user),token,refreshToken:generatedRefreshToken };
      return {
        ...ObjectManipulator.distruct(user),
        token,
        refreshToken: generatedRefreshToken,
      };
    } catch (err) {
      throw err;
    }
  }


  async requestOTP(body) {
    try {
      const { email } = body;

      // Find user by email
      const user = await User.findOne({ email: email?.toLowerCase() });

      if (!user) throw new Error("No user found with this email");
      if (user?.isDeleted || !user?.password) throw new Error("Please continue with your social account");

      const otp = generateOTP();
      const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // If OTP is valid, mark it as verified
      user.isOtpVerified = false;
      user.otp = Number(otp);
      user.otpExpiresAt = resetTokenExpiresAt;
      await user.save();

      await sendMailtoUser(
        MAIL_TYPES.OTP_MAIL,
        { name: user?.userName, email: email, otp: otp },
        email
      );

      return {
        id: user._id,
        email,
        otpExpiresAt: user.otpExpiresAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(body) {
    try {
      const { email, newPassword, confirmNewPassword } = body;

      if (newPassword !== confirmNewPassword)
        throw new Error("New password did not match with confirmed password");

      const user = await User.findOne({
        email: email?.toLowerCase(),
        password: { $ne: null },
      });

      if (!user) throw new Error("No user found with this email");
      if (user?.isDeleted === true)
        throw new Error("No user found with this email");

      if (!user.isOtpVerified) throw new Error("Your Otp is not verified!");

      if (new Date() > user.otpExpiresAt)
        throw new Error("Your Otp is expired!");

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      return { ...ObjectManipulator.distruct(user) };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserProfileByAccessToken(body) {
    try {
      const {
        token,
        provider,
        referalInvite,
        os,
        ipAddress,
        browserName,
        browserVersion,
        isMobile,
        mobileId,
        mobileName,
        type
      } = body;


      if (isMobile) {
        if (!mobileId || !mobileName) {
          throw new CustomError("Device information is required to login", 401);
        }
      }

      const data: any = { provider };
      let user;
      let referringUser;
      let googleResult;
      if (referalInvite) {
        // Find the referring user by their referral code
        referringUser = await User.findOne({ referralCode: referalInvite });
        if (!referringUser) {
          throw new Error("Referring user not found.");
        }
      }

      const referralCode = generateRandomString(9);
      if (provider == SOCIAL_AUTH.GOOGLE) {
        const result = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
        );
        googleResult = result
        const { data: responseData } = result;
        
        const registeredUser: any = await User.findOne({
          email: responseData.email,
          gmailProviderId: null,
          appleProviderId: null,
          isVerified: true
        });
        if(registeredUser){
          throw new CustomError("Account already exists with a different login method. Please sign in using the original method.", 401);
        }

        data.id = responseData.id;
        data.email = responseData.email;
        data.userName = responseData.given_name;
        user = await User.findOne({ email: data.email?.toLowerCase(), gmailProviderId: data.id });

        if (user && !user?.isReferralVerified && !type) {
          // throw new Error("Enter Valid Referral code to login.");
          return user
        }
        // if(user && !user?.userName){
        //   return user;
        // }
      } else if (provider == SOCIAL_AUTH.APPLE) {
        const idToken = jwt.decode(token);

        console.log({idToken});
        data.id = idToken.sub;
        data.email = idToken?.email;
        data.userName = idToken?.given_name;

        const registeredUser: any = await User.findOne({
          email: data.email,
          gmailProviderId: null,
          appleProviderId: null,
          isVerified: true
        });
        if(registeredUser){
          throw new CustomError("Account already exists with a different login method. Please sign in using the original method.", 401);
        }

        if (data.email) {
          user = await User.findOne({
            email: data.email,
            appleProvider: SOCIAL_AUTH.APPLE,
          });
          if (user && !user?.isReferralVerified && !type) {
            return user
          }
          // if(user && !user?.userName){
          //   return user;
          // }
        } else {
          user = await User.findOne({
            appleProviderId: data.id,
            appleProvider: SOCIAL_AUTH.APPLE,
          });
          if (user && !user?.isReferralVerified && !type) {
            // throw new Error("Enter Valid Referral code to login.");
            return user
          }
          // if(user && !user?.userName){
          //   return user;
          // }
          
        }
      } else throw new Error("Invalid Provider");

      const customer = await stripe.customers.create({
        email: data.email?.toLowerCase(),
        name: data.userName,
        description: "Loki Chat",
      });

      if (!user) {
        // User does not exist, create new user
        user = new User({
          userName: data.userName || null,
          email: data?.email?.toLowerCase() || null,
          isVerified: true,
          stripeId: customer?.id,
          referralCode: referralCode,
          invitedReferralCode: referalInvite,
          isReferralVerified: false,
        });
        //console.log({data}); 
        if (data.provider === SOCIAL_AUTH.GOOGLE) {
          user.gmailProvider = data.provider;
          user.gmailProviderId = data.id;
          user.profileUrl = googleResult?.data?.picture
        } else if (data.provider === SOCIAL_AUTH.APPLE) {
          user.appleProvider = data.provider;
          user.appleProviderId = data.id;
        }
        //console.log(googleResult, user, " google and user respectively");

        await user.save();
        if (user && !user?.isReferralVerified && !type) {
          return user
        }
        // if(user && !user?.userName){
        //   return user;
        // }

        if (referringUser) {
          referringUser.invitedUsers.push(user._id);
          await referringUser.save();
        }
      } else if (user && provider === SOCIAL_AUTH.GOOGLE) {
        // here will have to manage google
        user.gmailProvider = SOCIAL_AUTH.GOOGLE;
        user.gmailProviderId = data.id;
        user.isDeleted = false;
        user.isVerified = true;
        await user.save();
      } else if (user && provider === SOCIAL_AUTH.APPLE) {
        // here will have to manage apple
        user.appleProvider = SOCIAL_AUTH.APPLE;
        user.appleProviderId = data.id;
        user.isDeleted = false;
        user.isVerified = true;
        await user.save();
      }

      // save logged in device information
      const devicePayload: any = {
        userId: user._id,
        os,
        ipAddress,
        browserName,
        browserVersion,
        isMobile,
        mobileId,
        mobileName,
      };
      const savedDevice = await DevicesServices.saveDeviceIntoDB(
        devicePayload,
        false
      );

      // Create JWT token
      const jwtToken = jwt.sign(
        {
          userId: user._id,
          deviceId: savedDevice._id,
          role: user.role || USER_ROLES.USER,
        },
        config.jwtSecretKey,
        { expiresIn: config.jwtTokenExpiration }
      );

      const refreshToken = await this.saveRefreshToken(user);

      return {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        token: jwtToken,
        refreshToken,
        bio: user.bio,
        subscription: user.subscription,
        profileUrl: user.profileUrl,
        appleProviderId: user.appleProviderId,
        gmailProviderId: user.gmailProviderId,
        referralCode: user.referralCode,
        invitedReferralCode: user.invitedReferralCode,
        subscribedDate: user.subscribedDate,
        isReferralVerified: user.isReferralVerified
      };
    } catch (err) {
      throw err.response?.data.message || err.message;
    }
  }

  async referralDetail(req) {
    const { userId } = req.params;

    try {
      // Fetch the user by some identifier, e.g., req.user.id, which represents the current user
      const currentUser = await User.findById(userId)
        .populate({
          path: "invitedUsers",
          select: "userName email _id profileUrl", // Specify the fields you want to populate
        })
        .exec();

      if (!currentUser) {
        throw new Error("User not found");
      }

      const invitedUsers = currentUser.invitedUsers;
      return invitedUsers;
    } catch (err) {
      console.error(err);
      throw new Error("Something went wrong");
    }
  }

  async getUserById(req) {
    const { id } = req.params;

    try {
      // Fetch the user by some identifier, e.g., req.user.id, which represents the current user
      const currentUser = await User.findById(id)

      if (!currentUser) {
        throw new Error("User not found");
      }
      return currentUser;
    } catch (err) {
      console.error(err);
      throw new Error("Something went wrong");
    }
  }

  async referralDetails(req) {
    const { userId } = req.params;

    // Fetch the user by some identifier, e.g., req.user.id, which represents the current user
    const currentUser: any = await User.findById(userId)
      .populate({
        path: "invitedUsers",
        select: "userName email _id profileUrl subscription", // Specify the fields you want to populate
      })
      .exec();

    if (!currentUser) throw new Error("User not found");
    const returnedObject: any = {};
    returnedObject.loggedInUsersCount = size(currentUser.invitedUsers) || 0;
    returnedObject.loggedInUsers = currentUser.invitedUsers;
    returnedObject.subscribedUserCount = size(currentUser.subscribedUser) || 0;
    returnedObject.inviteUserCount = currentUser.inviteUserCount;
    returnedObject.subscriptionsLeft = 5 - size(currentUser.subscribedUser);
    return returnedObject;
  }

  async userDetail(req) {
    const { userId } = req.params;
    try {
      // Fetch the user by userId
      const userProfile: any = await User.findById(userId);

      if (!userProfile) {
        throw new Error("User not found");
      }
      return userProfile;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong");
    }
  }

  async userInviteCount(req) {
    const referralCode = req.body.referralCode;

    try {
      const referringUser = await User.findOne({ referralCode: referralCode });
      if (!referringUser) {
        throw new Error("Referring user not found.");
      }

      if (referringUser) {
        const updateUser = await User.findOneAndUpdate(
          { referralCode },
          { $inc: { inviteUserCount: 1 } }
        );

        return updateUser;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async refreshToken(req) {
    const {
      refreshToken,
      userId,
      os,
      ipAddress,
      browserName,
      browserVersion,
      isMobile,
      mobileId,
      mobileName,
    } = req.body;

    const user: any = await User.findById(userId);

    if (!user) throw new Error("invalid or unauthorised user");

    const existingRefreshToken: any = await RefreshToken.findOne({
      token: refreshToken,
      user: userId,
    });
    if (!existingRefreshToken) throw new Error("Invalid refresh token");

    const newRefreshToken = await generateRefreshToken();

    // save logged in device information
    const devicePayload: any = {
      userId: userId,
      os,
      ipAddress,
      browserName,
      browserVersion,
      isMobile,
      mobileId,
      mobileName,
    };
    const savedDevice = await DevicesServices.saveDeviceIntoDB(
      devicePayload,
      true
    );

    const token = jwt.sign(
      {
        userId: existingRefreshToken.user,
        deviceId: savedDevice._id,
        role: user.role || USER_ROLES.USER,
      },
      config.jwtSecretKey,
      {
        expiresIn: config.jwtTokenExpiration,
      }
    );

    existingRefreshToken.token = newRefreshToken;
    await existingRefreshToken.save();

    return { token, refreshToken: newRefreshToken };
  }
}

export default new AuthService();
