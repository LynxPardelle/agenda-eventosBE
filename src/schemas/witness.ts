import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
const mongoosePaginate = require("mongoose-paginate-v2");
export interface IWitness extends mongoose.Document {
  witness: IUser;
  createAt: Date;
}
export default mongoose.model<IWitness, PaginateModel<IWitness>>(
  "Witness",
  new mongoose.Schema({
    witness: { type: Schema.Types.ObjectId, ref: "User" },
    createAt: { type: Date, default: Date.now },
  }).plugin(mongoosePaginate)
);
