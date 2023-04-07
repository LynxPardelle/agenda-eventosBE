import mongoose, { PaginateModel, Schema } from "mongoose";
import { IEvento } from "./evento";
const mongoosePaginate = require("mongoose-paginate");
export default mongoose.model<IEvento, PaginateModel<IEvento>>(
  "EventoHistory",
  new mongoose.Schema({
    logo: { type: Schema.Types.ObjectId, ref: "File" },
    headerImage: { type: Schema.Types.ObjectId, ref: "File" },
    description: String,
    title: String,
    subtitle: String,
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    califications: [{ type: Schema.Types.ObjectId, ref: "Calification" }],
    witness: [{ type: Schema.Types.ObjectId, ref: "Witness" }],
    asistents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    operators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    ticketTypes: Number,
    photos: [{ type: Schema.Types.ObjectId, ref: "File" }],
    date: Date,
    place: String,
    titleColor: String,
    textColor: String,
    linkColor: String,
    bgColor: String,
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "EventoHistory" }],
  }).plugin(mongoosePaginate)
);
