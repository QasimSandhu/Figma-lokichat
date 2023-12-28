import AuthService from "../services/AuthService";
import { LoginRequest, RefreshTokenRequest } from "../requests/user/LoginRequest";
import { RegisterRequest } from "../requests/user/RegisterRequest";
import { OtpRequest, ResetPasswordRequest, RequestOTPRequest } from "../requests/user/OptRequest";
import { validate, ValidationError } from "class-validator";
import LoginResource from "../resources/Auth/LoginResource";
import RegisterResource from "../resources/Auth/RegisterResource";
import RequestOtpResource from "../resources/Auth/RequestOtpResource";
import VerifyOtpResource from "../resources/Auth/VerifyOtpResource";
import { isEmpty } from "lodash";
import CustomError from "..//middleware/CustomError";
import ReferralResource from "../resources/Auth/ReferralResource";
import { handleRequest } from "../lib/helpers/requestHelper";
import RefreshTokenResource from "../resources/Auth/RefreshTokenResource";
import GoogleLoginResource from "../resources/Auth/GoogleLoginResource";

class AuthController {
  async login(req, res) {
    try {
      const loginRequest = new LoginRequest(req);
      const errors = await validate(loginRequest);

      if (errors.length > 0) {
        const errorResponse: { [key: string]: string } = {};
        errors.forEach((error: ValidationError) => {
          Object.keys(error.constraints).forEach((key) => {
            errorResponse[error.property] = error.constraints[key];
          });
        });
        return res.status(422).json({ errors: errorResponse });
      }
      
      const result: any = await AuthService.login(req.body);
      
      if (isEmpty(result)) {
        return res.status(401).json(new LoginResource(result, "Invalid email or password", 401));
      }else  if(!result?.isReferralVerified){
        
        return res.status(500).json(new GoogleLoginResource(result, "User Enter Valid Referral code to login", 401));
      }else{
        return res.status(200).json(new LoginResource(result, "User loggedIN successfully", 200));
      }
      
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(new LoginResource(null, error.message, error.statusCode));
      } 
      return res.status(500).json(new LoginResource(null, error.message, 500));
    }
  }

  async register(req, res) {
    try {
      const registerRequest = new RegisterRequest(req);
      const errors = await validate(registerRequest);

      if (errors.length > 0) {
        const errorResponse: { [key: string]: string } = {};
        errors.forEach((error: ValidationError) => {
          Object.keys(error.constraints).forEach((key) => {
            errorResponse[error.property] = error.constraints[key];
          });
        });
        return res.status(422).json({ errors: errorResponse });
      }
      const result = await AuthService.register(req.body);
      return res.status(200).json(new RegisterResource(result));
    } catch (error) {
      return res.status(500).json(new RegisterResource(null, error.message));
    }
  }

  async verifyOtp(req, res) {
    try {
      const loginRequest = new OtpRequest(req);
      const errors = await validate(loginRequest);

      if (errors.length > 0) {
        const errorResponse: { [key: string]: string } = {};
        errors.forEach((error: ValidationError) => {
          Object.keys(error.constraints).forEach((key) => {
            errorResponse[error.property] = error.constraints[key];
          });
        });
        return res.status(422).json({ errors: errorResponse });
      }
      const result: any = await AuthService.verifyOtp(req.body);
      return res.status(200).json(new VerifyOtpResource(result));
    } catch (error) {
      return res.status(500).json(new LoginResource(null, error.message));
    }
  }
  async verifyReferralCode(req, res) {
    try {
      const result: any = await AuthService.verifyReferralCode(req.body);
      return res.status(200).json(new LoginResource(result, "User loggedIN successfully", 200));
    } catch (error) {
      return res.status(500).json(new LoginResource(null, error.message));
    }
  }


  async requestOTP(req, res) {
    try {
      const loginRequest = new RequestOTPRequest(req);
      const errors = await validate(loginRequest);

      if (errors.length > 0) {
        const errorResponse: { [key: string]: string } = {};
        errors.forEach((error: ValidationError) => {
          Object.keys(error.constraints).forEach((key) => {
            errorResponse[error.property] = error.constraints[key];
          });
        });
        return res.status(422).json({ errors: errorResponse });
      }
      const result: any = await AuthService.requestOTP(req.body);
      return res.status(200).json(new RequestOtpResource(result, 'OTP sent successfully'));
    } catch (error) {
      return res.status(500).json(new RequestOtpResource(null, error.message));
    }
  }

  async resetPassword(req, res) {
      try {
        const loginRequest = new ResetPasswordRequest(req);
        const errors = await validate(loginRequest);
  
        if (errors.length > 0) {
          const errorResponse: { [key: string]: string } = {};
          errors.forEach((error: ValidationError) => {
            Object.keys(error.constraints).forEach((key) => {
              errorResponse[error.property] = error.constraints[key];
            });
          });
          return res.status(422).json({ errors: errorResponse });
        }
        const result: any = await AuthService.resetPassword(req.body);
        return res.status(200).json(new LoginResource(result));
      } catch (error) {
        return res.status(500).json(new RequestOtpResource(null, error.message));
      }
    }

  async getUserProfile(req, res) {
    try {
      const { body } = req;
      const result = await AuthService.getUserProfileByAccessToken(body);
      
      //if(!result?.isReferralVerified){
        
      //  return res.status(500).json(new GoogleLoginResource(result, "User Enter Valid Referral code to login", 401));
      //}
      //else {
      return res.status(200).json(new LoginResource(result));
      //}
    } catch (error) {
      return res.status(500).json(new LoginResource(null, error));
    }
  }

  async referralDetail(req, res) {
    return handleRequest( req, res, null, AuthService.referralDetail, ReferralResource );
  }

  async getUserById(req, res) {
    return handleRequest( req, res, null, AuthService.getUserById, null );
  }

  async referralDetails(req, res) {
    return handleRequest( req, res, null, AuthService.referralDetails, ReferralResource );
  }

  async userDetail(req, res) {
    return handleRequest( req, res, null, AuthService.userDetail, ReferralResource );
  }
  async userInviteCount(req, res) {
    return handleRequest( req, res, null, AuthService.userInviteCount, ReferralResource );
  }

  async refreshToken(req, res) {
    return handleRequest( req, res, RefreshTokenRequest, AuthService.refreshToken, RefreshTokenResource );
  }

}

export default new AuthController();
