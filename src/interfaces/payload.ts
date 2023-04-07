import { IUser } from "../schemas/user";

export interface IPayload {
  _id: string;
  name: string;
  email: string;
  generalRole: string;
  iat: Date;
  exp: Date;
}
