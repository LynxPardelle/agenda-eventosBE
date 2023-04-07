import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
import { IActivity } from "./activity";
const mongoosePaginate = require("mongoose-paginate");
export default mongoose.model<IActivity, PaginateModel<IActivity>>(
  "ActivityHistory",
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
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "ActivityHistory" }],
  }).plugin(mongoosePaginate)
);
