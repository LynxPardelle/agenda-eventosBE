import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";
import { ITicket } from "./ticket";
export interface IUserHistory extends mongoose.Document {
  role: "asistente" | "operador" | "administrador" | "tecnico";
  tickets: ITicket[];
  email: { type: String; unique: true };
  password: String;
  lastPassword: String;
  passRec: String;
  verified: Boolean;
  uses: Number;
  name: String;
  createAt: Date;
  changeDate: Date;
  changeUser: IUser;
  changeType: String;
  ver: Number;
  isDeleted: Boolean;
  changeHistory: IUserHistory;
}
export default mongoose.model<IUserHistory>(
  "UserHistory",
  new mongoose.Schema({
    role: "asistente" || "operador" || "administrador" || "tecnico",
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
    email: String,
    password: String,
    lastPassword: String,
    passRec: String,
    verified: Boolean,
    uses: Number,
    name: String,
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: { type: Schema.Types.ObjectId, ref: "UserHistory" },
  })
);
