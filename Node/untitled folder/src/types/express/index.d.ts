import { Request } from 'express';
import IUser from '../..//interfaces/IUser';

declare global {
  namespace Express {
    interface Request {
      logout(): void;
      // @ts-ignore
      user?: IUser;
    }
  }
}