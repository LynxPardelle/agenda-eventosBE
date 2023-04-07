import { NextFunction, Response } from "express";
import { IRequestWithPayload } from "../interfaces/requestWithPayload";
export function isOperador(
  req: IRequestWithPayload,
  res: Response,
  next: NextFunction
): Response | void {
  if (
    !req.user ||
    !["operador", "administrador", "técnico"].includes(req.user.generalRole)
  ) {
    return res.status(403).send({ message: " No tienes acceso a esta zona" });
  }
  next();
}
export function isAdmin(
  req: IRequestWithPayload,
  res: Response,
  next: NextFunction
): Response | void {
  if (
    !req.user ||
    !["administrador", "técnico"].includes(req.user.generalRole)
  ) {
    return res.status(403).send({ message: " No tienes acceso a esta zona" });
  }
  next();
}
export function isTecn(
  req: IRequestWithPayload,
  res: Response,
  next: NextFunction
): Response | void {
  if (req.user?.generalRole !== "técnico") {
    return res.status(403).send({ message: " No tienes acceso a esta zona" });
  }
  next();
}
