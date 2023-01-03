/* Modules */
import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import jwt from "../lib/jwt";
import secret from "../keys";
import populate from "../lib/populate";
/* Models */
import Main, { IMain } from "../schemas/main";
import File, { IFile } from "../schemas/file";
/* Controller */
const controller = {
  /* Test */
  datosAutor: (req: Request, res: Response) => {
    return res.status(200).send({
      autor: "Lynx Pardelle",
      url: "https://www.lynxpardelle.com",
    });
  },
  /* Create */
  /* Read */
  async getMain(req: Request, res: Response) {
    let nErr: number = 500;
    try {
      let main: IMain | null = await Main.findOne();
      if (main === null) {
        throw new Error("No hay main.");
      }
      return res.status(200).send({
        status: "success",
        main: main,
      });
    } catch (e: any) {
      console.log(e);
      return res.status(nErr).send({
        status: "error",
        message: e.message,
        e: e,
      });
    }
  },
  /* Update */
  /* Delete */
  /* Files */
};

export default controller;
