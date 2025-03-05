/* Modules */
import { Router } from "express";
import { UserController } from "../controllers/user";
import {
  ensureAuth as md_auth,
  optionalAuth as md_optional_auth,
} from "../middlewares/authenticated";
import * as md_role from "../middlewares/is_role";
const router: Router = Router();
/* Test Routes */
router.get("/datos-autor", UserController.datosAutor);
/* Create */
router.post("/user", md_optional_auth, UserController.createUser);
/* Read */
router.get("/user/:id/:filter", md_optional_auth, UserController.getUser);
router.get(
  "/users/:page?/:limit?/:sort?/:type?/:search?",
  [md_auth, md_role.isOperador],
  UserController.getUsers
);
/* Update & Delete */
router.put(
  "/user/:type",
  [md_auth, md_role.isOperador],
  UserController.updateUser
);
/* Login */
router.post("/login", UserController.login);
export default router;