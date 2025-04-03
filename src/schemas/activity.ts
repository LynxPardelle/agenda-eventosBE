import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
import { IWitness } from "./witness";
import { ICalification } from "./calification";
const mongoosePaginate = require("mongoose-paginate-v2");
export interface IActivity extends mongoose.Document {
  ticketType: number;
  title: string;
  subtitle: string;
  description: string;
  headerImage: IFile;
  photos: IFile[];
  califications: ICalification[];
  witness: IWitness[];
  date: Date;
  place: string;
  titleColor: string;
  textColor: string;
  linkColor: string;
  bgColor: string;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IActivity[];
}
export default mongoose.model<IActivity, PaginateModel<IActivity>>(
  "Activity",
  new mongoose.Schema({
    ticketType: Number,
    title: String,
    subtitle: String,
    description: String,
    headerImage: { type: Schema.Types.ObjectId, ref: "File" },
    photos: [{ type: Schema.Types.ObjectId, ref: "File" }],
    califications: [{ type: Schema.Types.ObjectId, ref: "Calification" }],
    witness: [{ type: Schema.Types.ObjectId, ref: "Witness" }],
    date: Date,
    place: String,
    titleColor: String,
    textColor: String,
    linkColor: String,
    bgColor: String,
    createAt: { type: Date, default: Date.now },
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "ActivityHistory" }],
  }).plugin(mongoosePaginate)
);
