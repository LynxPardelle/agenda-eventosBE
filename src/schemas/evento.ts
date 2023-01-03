import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
import { IActivity } from "./activity";
import { IWatch } from "./watch";
export interface IEvento extends mongoose.Document {
  logo: IFile;
  headerImage: IFile;
  description: String;
  title: String;
  subtitle: String;
  activities: IActivity[];
  calification: Number;
  watchs: IWatch[];
  asistents: IUser[];
  operators: IUser[];
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: String;
  ver: Number;
  isDeleted: Boolean;
  changeHistory: IEvento;
}
export default mongoose.model<IEvento>(
  "Evento",
  new mongoose.Schema({
    logo: { type: Schema.Types.ObjectId, ref: "File" },
    headerImage: { type: Schema.Types.ObjectId, ref: "File" },
    description: String,
    title: String,
    subtitle: String,
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    calification: Number,
    watchs: [{ type: Schema.Types.ObjectId, ref: "Watch" }],
    asistents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    operators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: { type: Schema.Types.ObjectId, ref: "EventoHistory" },
  })
);
