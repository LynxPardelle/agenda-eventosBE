/* Modules */
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
/* Import Routes */
import main_routes from "./routes/main";
import user_routes from "./routes/user";
import evento_routes from "./routes/evento";
/* Init */
const app = express();
import "./database";
/* Middlewares */
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
/* Config Headers & CORS */
const allowedDomains = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(",").map((domain) => domain.trim()): [];
console.log("Allowed domains:", allowedDomains);
app.use(
  cors({
    origin: (origin, callback) => {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. 
        Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
/* Routes */
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});
app.use(
  "/",
  express.static("client", {
    redirect: false,
  })
);
app.use("/api/main", main_routes);
app.use("/api/user", user_routes);
app.use("/api/evento", evento_routes);
/* Test */
app.get("/datos-autor", (req: Request, res: Response) => {
  console.log("Hello World");
  res.status(200).send({
    autor: "Lynx Pardelle",
    url: "https://www.lynxpardelle.com",
  });
});
/* Static files */
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve("client/index.html"));
});
/* Port */
app.set("port", process.env.PORT || "3669");
/* Start Server */
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
