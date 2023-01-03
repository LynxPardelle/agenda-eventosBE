import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
export interface IWatch extends mongoose.Document {
  watcher: IUser;
  createAt: Date;
}
export default mongoose.model<IWatch>(
  "Watch",
  new mongoose.Schema({
    watcher: { type: Schema.Types.ObjectId, ref: "User" },
    createAt: Date,
  })
);
