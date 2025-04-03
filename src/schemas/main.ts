import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
import { IFile } from "./file";
const mongoosePaginate = require("mongoose-paginate-v2");
export interface IMain extends mongoose.Document {
  logo: IFile;
  title: string;
  welcome: string;
  titleColor: string;
  textColor: string;
  linkColor: string;
  bgColor: string;
  errorMsg: string;
  seoDesc: string;
  seoTags: string;
  seoImg: string;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IMain[];
}
export default mongoose.model<IMain, PaginateModel<IMain>>(
  "Main",
  new mongoose.Schema({
    logo: { type: Schema.Types.ObjectId, ref: "File" },
    title: String,
    welcome: String,
    titleColor: String,
    textColor: String,
    linkColor: String,
    bgColor: String,
    errorMsg: String,
    seoDesc: String,
    seoTags: String,
    seoImg: String,
    createAt: { type: Date, default: Date.now },
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "MainHistory" }],
  }).plugin(mongoosePaginate)
);
