"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoosePaginate = require("mongoose-paginate");
exports.default = mongoose_1.default.model("ActivityHistory", new mongoose_1.default.Schema({
    ticketType: Number,
    title: String,
    subtitle: String,
    description: String,
    headerImage: { type: mongoose_1.Schema.Types.ObjectId, ref: "File" },
    photos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "File" }],
    califications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Calification" }],
    witness: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Witness" }],
    date: Date,
    place: String,
    titleColor: String,
    textColor: String,
    linkColor: String,
    bgColor: String,
    createAt: Date,
    changeDate: Date,
    changeUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    changeType: String,
    ver: Number,
    isDeleted: Boolean,
    changeHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ActivityHistory" }],
}).plugin(mongoosePaginate));
