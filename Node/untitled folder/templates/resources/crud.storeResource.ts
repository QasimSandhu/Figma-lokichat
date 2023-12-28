import ApiResponse from '../../lib/response/ApiResponse';

interface templateNameStoreResourceProps {
    name: String
}

class templateNameStoreResource extends ApiResponse {
    constructor(data: templateNameStoreResourceProps | templateNameStoreResourceProps[]) {
        if(data){
            const formattedData = Array.isArray(data) ? data.map(formatData) : formatData(data);
            super(ApiResponse.success(formattedData, 'templateName stored successfully.'));
        }
        else{
            super(ApiResponse.error('Unable to store the templateName with given data.'));
        }
    }
}

function formatData(data: any): any {
    return data;
}

export default templateNameStoreResource;
