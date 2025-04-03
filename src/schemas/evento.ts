import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
import { IActivity } from "./activity";
import { IWitness } from "./witness";
import { ICalification } from "./calification";
import { ITicket } from "./ticket";
const mongoosePaginate = require("mongoose-paginate-v2");
export interface IEvento extends mongoose.Document {
  logo: IFile;
  headerImage: IFile;
  description: string;
  title: string;
  subtitle: string;
  activities: IActivity[];
  califications: ICalification[];
  witness: IWitness[];
  asistents: IUser[];
  operators: IUser[];
  ticketTypes: number;
  photos: IFile[];
  date: Date;
  place: string;
  titleColor: string;
  textColor: string;
  linkColor: string;
  bgColor: string;
  tickets: ITicket[];
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IEvento[];
}
export default mongoose.model<IEvento, PaginateModel<IEvento>>(
  "Evento",
  new mongoose.Schema({
    logo: { type: Schema.Types.ObjectId, ref: "File" },
    headerImage: { type: Schema.Types.ObjectId, ref: "File" },
    description: String,
    title: String,
    subtitle: String,
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    califications: [{ type: Schema.Types.ObjectId, ref: "Calification" }],
    witness: [{ type: Schema.Types.ObjectId, ref: "Witness" }],
    asistents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    operators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    ticketTypes: Number,
    photos: [{ type: Schema.Types.ObjectId, ref: "File" }],
    date: Date,
    place: String,
    titleColor: String,
    textColor: String,
    linkColor: String,
    bgColor: String,
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
    createAt: { type: Date, default: Date.now },
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "EventoHistory" }],
  }).plugin(mongoosePaginate)
);
