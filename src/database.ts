import mongoose, { ConnectOptions } from "mongoose";
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(
    typeof process.env.mongoDBURI === "string" ? process.env.mongoDBURI : "",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(() => {
    console.log(
      "La conexión a la base de datos de Agenda Eventos se ha realizado correctamente."
    );
  })
  .catch((e) => console.log(e));
