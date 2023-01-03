import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
export interface IMain extends mongoose.Document {
  logo: String;
  title: String;
  welcome: String;
  titleColor: String;
  textColor: String;
  linkColor: String;
  bgColor: String;
  errorMsg: String;
  seoDesc: String;
  seoTags: String;
  seoImg: String;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: String;
  ver: Number;
  isDeleted: Boolean;
  changeHistory: IMain[];
}
export default mongoose.model<IMain>(
  "Main",
  new mongoose.Schema({
    logo: String,
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
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "MainHistory" }],
  })
);
