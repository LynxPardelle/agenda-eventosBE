/* Modules */
import { Router } from "express";
import { EventoController } from "../controllers/evento";
import multer from "multer";
import {
  ensureAuth as md_auth,
  optionalAuth as md_optional_auth,
} from "../middlewares/authenticated";
import * as md_role from "../middlewares/is_role";
const router: Router = Router();
const md_upload = multer({ dest: "./uploads/evento" }).any();
/* Test Routes */
router.get("/datos-autor", EventoController.datosAutor);
/* Create */
router.post("/activity/:id", md_auth, EventoController.createActivity);
router.post(
  "/calification/:type/:id",
  md_auth,
  EventoController.createCalification
);
router.post("/evento", md_auth, EventoController.createEvento);
router.post(
  "/ticket/:userId/:eventoId",
  md_auth,
  EventoController.createTicket
);
/* Read */
router.get("/evento/:id", EventoController.getEvento);
router.get(
  "/eventos/:page?/:limit?/:sort?/:type?/:search?",
  [md_auth, md_role.isOperador],
  EventoController.getEventos
);
router.get(
  "/activity/:id/:firstOpen?",
  md_optional_auth,
  EventoController.viewActivity
);
/* Update & Delete */
router.put(
  "/activity/:type",
  [md_auth, md_role.isOperador],
  EventoController.updateActivity
);
router.put(
  "/calification/:type",
  [md_auth, md_role.isOperador],
  EventoController.updateEvento
);
router.put(
  "/evento/:type",
  [md_auth, md_role.isOperador],
  EventoController.updateEvento
);
router.put(
  "/ticket/:type",
  [md_auth, md_role.isOperador],
  EventoController.updateEvento
);
/* Files */
router.post(
  "/files/:typeObj/:type/:id",
  [md_auth, md_upload],
  EventoController.UploadFiles
);
router.delete(
  "/file/:typeObj/:type/:idObj/:id",
  md_auth,
  EventoController.deleteFile
);
router.get("/file/:file", EventoController.getFile);
export default router;
