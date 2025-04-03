import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
import { IEvento } from "./evento";
import { IActivity } from "./activity";
const mongoosePaginate = require("mongoose-paginate-v2");
export interface ITicket extends mongoose.Document {
  type: number;
  evento: IEvento;
  user: IUser;
  role: string;
  activitiesAdmin: IActivity[];
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: ITicket[];
}
export default mongoose.model<ITicket, PaginateModel<ITicket>>(
  "Ticket",
  new mongoose.Schema({
    type: Number,
    evento: { type: Schema.Types.ObjectId, ref: "Evento" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: [
        "asistente",
        "operador general",
        "operador de actividad",
        "operador de asistentes",
      ],
      default: "asistente",
    },
    activitiesAdmin: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    createAt: { type: Date, default: Date.now },
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "TicketHistory" }],
  }).plugin(mongoosePaginate)
);
