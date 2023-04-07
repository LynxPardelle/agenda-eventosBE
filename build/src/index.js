"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Modules */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
/* Import Routes */
const main_1 = __importDefault(require("./routes/main"));
const user_1 = __importDefault(require("./routes/user"));
const evento_1 = __importDefault(require("./routes/evento"));
/* Init */
const app = (0, express_1.default)();
require("./database");
/* Middlewares */
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
/* Config Headers & CORS */
const allowedDomains = [
    "*",
    "http://localhost:4200",
    "http://localhost:3669",
    "http://agenda-eventos.lynxpardelle.com",
    "https://agenda-eventos.lynxpardelle.com",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin)
            return callback(null, true);
        if (allowedDomains.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. 
        Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
/* Routes */
app.use("/", express_1.default.static("client", {
    redirect: false,
}));
app.use("/api/main", main_1.default);
app.use("/api/user", user_1.default);
app.use("/api/evento", evento_1.default);
/* Test */
app.get("/datos-autor", (req, res) => {
    console.log("Hello World");
    return res.status(200).send({
        autor: "Lynx Pardelle",
        url: "https://www.lynxpardelle.com",
    });
});
/* Static files */
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve("client/index.html"));
});
/* Port */
app.set("port", process.env.PORT || "3669");
/* Start Server */
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});
