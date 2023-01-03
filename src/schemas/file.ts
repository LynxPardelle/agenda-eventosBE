import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
export interface IFile extends mongoose.Document {
  title: String;
  location: String;
  size: String;
  type: String;
  owner: IUser;
  createAt: Date;
}
export default mongoose.model<IFile>(
  "File",
  new mongoose.Schema({
    title: String,
    location: String,
    size: String,
    type: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    createAt: Date,
  })
);
