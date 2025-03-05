/* Modules */
import { Router } from "express";
import { MainController } from "../controllers/main";
const router: Router = Router();
/* Test Routes */
router.get("/datos-autor", MainController.datosAutor);
/* Create */
/* Read */
router.get("/main", MainController.getMain);
/* Update */
/* Delete */
/* Files */
export default router;
