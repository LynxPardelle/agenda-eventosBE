import mongoose, { PaginateModel, Schema } from "mongoose";
import { IUser } from "./user";
const mongoosePaginate = require("mongoose-paginate-v2");
export default mongoose.model<IUser, PaginateModel<IUser>>(
  "UserHistory",
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
    email: String,
    password: String,
    lastPassword: String,
    passRec: String,
    verified: Boolean,
    uses: Number,
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "UserHistory" }],
  }).plugin(mongoosePaginate)
);
