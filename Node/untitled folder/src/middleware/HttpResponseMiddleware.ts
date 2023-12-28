import { Request, Response, NextFunction } from 'express';
import HttpResponse from '../lib/response/HttpResponse';

interface CustomResponse extends Response {
  httpResponse?: HttpResponse;
}

function httpResponseMiddleware(req: Request, res: CustomResponse, next: NextFunction) {
  res.httpResponse = new HttpResponse('', 200, {});
  next();
}

export default httpResponseMiddleware;
