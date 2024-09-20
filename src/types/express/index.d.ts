import { IUser } from '../../models/user.model.ts';

declare namespace Express {
  export interface Request {
    user?: IUser;
  }
}