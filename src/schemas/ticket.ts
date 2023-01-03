import mongoose, { Schema } from "mongoose";
import TicketHistory from "./ticketHistory";
import { IUser } from "./user";
import { IEvento } from "./evento";
export interface ITicket extends mongoose.Document {
  type: String;
  evento: IEvento;
  user: IUser;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: String;
  ver: Number;
  isDeleted: Boolean;
  changeHistory: ITicket;
}
export default mongoose.model<ITicket>(
  "Ticket",
  new mongoose.Schema({
    type: String,
    evento: { type: Schema.Types.ObjectId, ref: "Evento" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "TicketHistory" }],
  })
);
