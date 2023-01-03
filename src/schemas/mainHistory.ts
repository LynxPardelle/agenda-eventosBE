import mongoose, { Schema } from "mongoose";
import { IMain } from "./main";
export default mongoose.model<IMain>(
  "MainHistory",
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
