import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
const mongoosePaginate = require("mongoose-paginate");
export interface ICalification extends mongoose.Document {
  calificator: IUser;
  calification: number;
  comment: string;
  createAt: Date;
}
export default mongoose.model<ICalification, PaginateModel<ICalification>>(
  "Calification",
  new mongoose.Schema({
    calificator: { type: Schema.Types.ObjectId, ref: "User" },
    calification: Number,
    comment: String,
    createAt: Date,
  }).plugin(mongoosePaginate)
);
