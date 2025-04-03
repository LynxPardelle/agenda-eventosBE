import mongoose, { PaginateModel, Schema } from "mongoose";
import { IMain } from "./main";
const mongoosePaginate = require("mongoose-paginate-v2");
export default mongoose.model<IMain, PaginateModel<IMain>>(
  "MainHistory",
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
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "MainHistory" }],
  }).plugin(mongoosePaginate)
);
