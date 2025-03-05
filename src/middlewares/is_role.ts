import { NextFunction, Request, Response } from "express";
export function isOperador(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    !(req as any).user ||
    !["operador", "administrador", "técnico"].includes((req as any).user.generalRole)
  ) {
    res.status(403).send({ message: " No tienes acceso a esta zona" });
  } else {
  next();
  }
}
export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    !(req as any).user ||
    !["administrador", "técnico"].includes((req as any).user.generalRole)
  ) {
    res.status(403).send({ message: " No tienes acceso a esta zona" });
  } else {
    next();
  }
}
export function isTecn(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if ((req as any).user?.generalRole !== "técnico") {
    res.status(403).send({ message: " No tienes acceso a esta zona" });
  } else {
    next();
  }
}
