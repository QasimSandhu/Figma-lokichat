import ApiResponse from '../../src/lib/response/ApiResponse';



class templateNameDestroyResource extends ApiResponse {
    constructor(data: boolean) {
        if(data){
            super(ApiResponse.success([], 'templateName deleted successfully.'));
        }
        else{
            super(ApiResponse.error('Unable to delete the templateName with given data.'));
        }
    }
}


export default templateNameDestroyResource;
