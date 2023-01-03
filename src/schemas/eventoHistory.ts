import mongoose, { Schema } from "mongoose";
import { IEvento } from "./evento";
export default mongoose.model<IEvento>(
  "EventoHistory",
  new mongoose.Schema({
    logo: { type: Schema.Types.ObjectId, ref: "File" },
    headerImage: { type: Schema.Types.ObjectId, ref: "File" },
    description: String,
    title: String,
    subtitle: String,
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    calification: Number,
    watchs: [{ type: Schema.Types.ObjectId, ref: "Watch" }],
    asistents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    operators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: { type: Schema.Types.ObjectId, ref: "EventoHistory" },
  })
);
