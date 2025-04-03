import mongoose, { PaginateModel, Schema } from "mongoose";
import { ITicket } from "./ticket";
const mongoosePaginate = require("mongoose-paginate-v2");
export interface IUser extends mongoose.Document {
  name: string;
  roleType: "basic" | "premium" | "special";
  generalRole: "asistente" | "operador" | "administrador" | "técnico";
  tickets: ITicket[];
  email: string;
  password?: string;
  lastPassword?: string;
  passRec: string;
  verified: boolean;
  uses: number;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: string;
  ver: number;
  isDeleted: boolean;
  changeHistory: IUser[];
}
export default mongoose.model<IUser, PaginateModel<IUser>>(
  "User",
  new mongoose.Schema({
    name: String,
    roleType: {
      type: String,
      enum: ["basic", "premium", "special"],
      default: "basic",
    },
    generalRole: {
      type: String,
      enum: ["asistente", "operador", "administrador", "técnico"],
      default: "asistente",
    },
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
    email: { type: String, unique: true },
    password: String,
    lastPassword: String,
    passRec: String,
    verified: Boolean,
    uses: Number,
    createAt: { type: Date, default: Date.now },
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "UserHistory" }],
  }).plugin(mongoosePaginate)
);
