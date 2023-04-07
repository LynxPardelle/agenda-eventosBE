import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
const mongoosePaginate = require("mongoose-paginate");
export interface IFile extends mongoose.Document {
  title: string;
  location: string;
  size: number;
  type: string;
  owner: IUser;
  createAt: Date;
}
export default mongoose.model<IFile, PaginateModel<IFile>>(
  "File",
  new mongoose.Schema({
    title: String,
    location: String,
    size: Number,
    type: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    createAt: Date,
  }).plugin(mongoosePaginate)
);
