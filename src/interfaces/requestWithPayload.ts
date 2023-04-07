import { Request } from "express";
import { IPayload } from "./payload";
export interface IRequestWithPayload extends Request {
  user?: IPayload;
}
