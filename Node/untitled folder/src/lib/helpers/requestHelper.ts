import { validate, ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

export async function handleRequest(req: Request, res: Response, requestObject: any, serviceFunction: any, resourceObject?: any) {
  try {

    if(requestObject){
      const request = new requestObject(req);
      const errors = await validate(request);
  
      if (errors.length > 0) {
        const errorResponse: { [key: string]: string } = {};
        errors.forEach((error: ValidationError) => {
          Object.keys(error.constraints).forEach(key => {
            errorResponse[error.property] = error.constraints[key];
          });
        });
        return res.status(422).json({ errors: errorResponse });
      }
    }

    const result: any = await serviceFunction(req);
    if(resourceObject){
      return res.status(200).json(new resourceObject(result));
    } else {
      return res.status(200).json(result);
    }

  } catch (error) {
    if(resourceObject){
      return res.status(500).json(new resourceObject(null, error.message));
    } else {
      return res.status(500).json({
        success: false, 
        message: error.message || 'Something went wrong',
        data: null
     });
    }
  }
}