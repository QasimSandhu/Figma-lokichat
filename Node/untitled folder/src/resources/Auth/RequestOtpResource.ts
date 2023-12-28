import ApiResponse from '../../lib/response/ApiResponse';
import mongoose from 'mongoose';

interface RequestOtpResourceProps {
    _id: string | mongoose.Types.ObjectId;
    userName: string;
    email: string;
    otpExpiresAt: string | Date;
    isOtpVerified: boolean;
}

class RequestOtpResource extends ApiResponse {
    constructor(data: RequestOtpResourceProps, message = 'Email not found') {
        if(!data){
            super(ApiResponse.error(message));
        }
        else{
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse.success(formattedData, message));
        }
    }
}

function formatData(data: RequestOtpResourceProps): any {
    return {
        id: data._id,
        email: data.email,
        userName: data.userName,
        otpExpiresAt: data.otpExpiresAt,
        isOtpVerified: data.isOtpVerified,
    };
}

export default RequestOtpResource;
