import ApiResponse from '../../lib/response/ApiResponse';
import mongoose from 'mongoose';

interface RegisterResourceProps {
    _id: string | mongoose.Types.ObjectId;
    userName: string;
    email: string;
    otpExpiresAt: string | Date;
    isOtpVerified: boolean;
    subscription?:string;
    profileUrl?:string
}

class RegisterResource extends ApiResponse {
    constructor(data: RegisterResourceProps, error = 'Server Error') {
        if(!data){
            super(ApiResponse.error(error));
        }
        else{
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse.success(formattedData, 'OTP sent successfully'));
        }
    }
}

function formatData(data: RegisterResourceProps): any {
    return {
        id: data._id,
        email: data.email,
        userName: data.userName,
        otpExpiresAt: data.otpExpiresAt,
        isOtpVerified: data.isOtpVerified,
        subscription:data.subscription,
        profileUrl:data.profileUrl
    };
}

export default RegisterResource;
