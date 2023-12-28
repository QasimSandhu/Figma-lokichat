//@ts-nocheck
import ApiResponse from '../lib/response/ApiResponse';

interface templateNameResourceProps {
    
}

class templateNameResource extends ApiResponse {
    constructor(data: templateNameResourceProps | templateNameResourceProps[]) {
        const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
        super(ApiResponse.success(formattedData, 'templateName successful'));
    }
}

function formatData(data: templateNameResourceProps): any {
    return data;
    /**
     * return {
     * id:data.id,
     * name:data.name
     * }
     */
}

export default templateNameResource;
