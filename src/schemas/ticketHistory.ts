import mongoose, { Schema } from "mongoose";
import { ITicket } from "./ticket";
export default mongoose.model<ITicket>(
  "TicketHistory",
  new mongoose.Schema({
    type: String,
    evento: { type: Schema.Types.ObjectId, ref: "Evento" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    createAt: Date,
    changeDate: Date,
    changeUser: { type: Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: Schema.Types.ObjectId, ref: "TicketHistory" }],
  })
);
