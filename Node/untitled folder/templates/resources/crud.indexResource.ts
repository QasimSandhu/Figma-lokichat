import ApiResponse from '../../lib/response/ApiResponse';

class templateNameIndexResource extends ApiResponse {
  constructor(data: any) {
    const formattedData = Array.isArray(data)
      ? data.map((d) => formatData(d.data))
      : formatData(data.data);
    
    super(
      ApiResponse.success(
        {
          data: formattedData,
          current_page: data.current_page,
          per_page: data.per_page,
          total: data.total,
          last_page: Math.ceil(data.total / data.per_page),
        },
        'templateName fetched successfully.'
      )
    );
  }
}

function formatData(data: any): any {
  return data;
  // return {
  //     id: data._id,
  //     email: data.email,
  //     userName: data.userName
  // };
}

export default templateNameIndexResource;
