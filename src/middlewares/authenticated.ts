/* Modules */
import { NextFunction, Request, Response } from "express";
import jwt from "jwt-simple";
import moment from "moment";
const secret = process.env.SECRET ? process.env.SECRET : "";
export function ensureAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.headers['authorization']) {
    res
      .status(403)
      .send({ message: "La petición no tiene la cabecera de autenticación." });
  } else {
    const token = req.headers['authorization'].replace(/['"]+/g, "");
    try {
      const payload = jwt.decode(token, secret);
      if (payload.exp <= moment().unix()) {
        res.status(401).send({
          message: "El token ha expirado",
        });
      }
      (req as any).user = payload;
    } catch (e) {
      res.status(404).send({
        message: "El token no es válido",
      });
    }
    next();
  }
}
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req && req.headers && req.headers['authorization']) {
    const token: string = req.headers['authorization'].replace(/['"]+/g, "");
    try {
      const payload = jwt.decode(token, secret);
      if (payload.exp <= moment().unix()) {
        res.status(401).send({
          message: "El token ha expirado",
        });
      }
      (req as any).user = payload;
    } catch (e) {
      res.status(404).send({
        message: "El token no es válido",
      });
    }
    next();
  } else {
    next();
  }
}
