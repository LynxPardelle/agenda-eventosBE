/* Modules */
import { Response } from "express";

const isAdmin = (req: any, res: Response, next: any) => {
  if (req.user.role != "ROLE_ADMIN") {
    return res.status(200).send({ message: " No tienes acceso a esta zona" });
  }
  next();
};

export default isAdmin;
