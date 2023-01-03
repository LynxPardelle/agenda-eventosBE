import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
import { IWatch } from "./watch";
export interface IActivity extends mongoose.Document {
  ticketTipe: String | Number;
  title: String;
  subtitle: String;
  description: String;
  headerImage: IFile;
  files: IFile[];
  calification: Number;
  watchs: IWatch[];
  date: Date;
  place: String;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: String;
  ver: Number;
  isDeleted: Boolean;
  changeHistory: IActivity;
}
export default mongoose.model<IActivity>(
  "Activity",
  new mongoose.Schema({
    ticketTipe: String || Number,
    title: String,
    subtitle: String,
    description: String,
    headerImage: { type: Schema.Types.ObjectId, ref: "File" },
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
    calification: Number,
    watchs: [{ type: Schema.Types.ObjectId, ref: "Watch" }],
    date: Date,
    place: String,
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: { type: Schema.Types.ObjectId, ref: "ActivityHistory" },
  })
);
