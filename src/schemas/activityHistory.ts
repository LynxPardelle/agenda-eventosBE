import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
import { IActivity } from "./activity";
export default mongoose.model<IActivity>(
  "ActivityHistory",
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
