"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(typeof process.env.mongoDBURI === "string" ? process.env.mongoDBURI : "")
    .then(() => {
    console.log("La conexión a la base de datos de Agenda Eventos se ha realizado correctamente.");
})
    .catch((e) => console.log(e));
