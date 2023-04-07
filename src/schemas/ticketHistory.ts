import mongoose, { PaginateModel, Schema } from "mongoose";
import { ITicket } from "./ticket";
const mongoosePaginate = require("mongoose-paginate");
export default mongoose.model<ITicket, PaginateModel<ITicket>>(
  "TicketHistory",
  new mongoose.Schema({
    type: Number,
    evento: { type: Schema.Types.ObjectId, ref: "Evento" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: [
        "asistente",
        "operador general",
        "operador de actividad",
        "operador de asistentes",
      ],
      default: "asistente",
    },
    activitiesAdmin: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "TicketHistory" }],
  }).plugin(mongoosePaginate)
);
