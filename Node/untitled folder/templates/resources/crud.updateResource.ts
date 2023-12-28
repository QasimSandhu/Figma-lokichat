import ApiResponse from '../../lib/response/ApiResponse';

interface templateNameUpdateResourceProps {
    name: string
}

class templateNameUpdateResource extends ApiResponse {
    constructor(data: templateNameUpdateResourceProps | templateNameUpdateResourceProps[]) {
        if(data){
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse.success(formattedData, 'templateName updated successfully.'));
        }
        else{
            super(ApiResponse.error('Unable to update the templateName with given data.'));
        }
    }
}

function formatData(data: any): any {
    return data;
}

export default templateNameUpdateResource;
