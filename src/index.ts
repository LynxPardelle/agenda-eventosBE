/* Modules */
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";

/* Import Routes */
import main_routes from "./routes/main";

/* Init */
const app = express();
import "./database";

/* Middlewares */
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

/* Config Headers & CORS */
const allowedDomains = [
  "http://localhost:4200",
  "http://localhost:6668",
  "https://agenda-eventos.lynxpardelle.com",
  "https://agenda-eventos.lynxpardelle.com",
];
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
  })
);

/* Routes */
app.use("/api/main", main_routes);

/* Static files */
app.use("/", express.static("client", { redirect: false }));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve("client/index.html"));
});

app.get("/datos-autor", (req: Request, res: Response) => {
  console.log("Hello World");
  return res.status(200).send({
    autor: "Lynx Pardelle",
    url: "https://www.lynxpardelle.com",
  });
});

/* Start Server */
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
