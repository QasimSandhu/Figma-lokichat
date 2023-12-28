import ApiResponse from '../../lib/response/ApiResponse';

interface VerifyOtpResourceProps {
    email: string;
    otp: number;
    isOtpVerified: boolean;
}

class VerifyOtpResource extends ApiResponse {
    constructor(data: VerifyOtpResourceProps, message = 'Invalid OTP data') {
        if(!data){
            super(ApiResponse.error(message));
        }
        else{
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse.success(formattedData, 'OTP verified successfully'));
        }
    }
}

function formatData(data: VerifyOtpResourceProps): any {
    return {
        email: data.email,
        otp: data.otp,
        isOtpVerified: data.isOtpVerified,
    };
}

export default VerifyOtpResource;
