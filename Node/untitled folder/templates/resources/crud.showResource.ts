import ApiResponse from '../../lib/response/ApiResponse';

interface templateNameShowResourceProps {
    name: string
}

class templateNameShowResource extends ApiResponse {
    constructor(data: templateNameShowResourceProps | templateNameShowResourceProps[]) {
        if(data){
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse.success(formattedData, 'templateName details fethed successfully.'));
        }
        else{
            super(ApiResponse.error('Unable to find templateName with given data.'));
        }
        
    }
}

function formatData(data: any): any {
    return data;
}

export default templateNameShowResource;
