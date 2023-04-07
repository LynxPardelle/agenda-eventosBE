/* Modules */
import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import jwt from "../lib/jwt";
import populate from "../lib/populate";
/* Models */
import Main, { IMain } from "../schemas/main";
import File, { IFile } from "../schemas/file";
/* Controllers */
import { UserController } from "./user";
/* Env */
const secret = process.env.SECRET ? process.env.SECRET : "";
/* Controller */
export const MainController = {
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
        let newUsers: any[] = [
          {
            name: "Test User",
            roleType: "basic",
            generalRole: "asistente",
            tickets: [],
            email: "lnxdrk@gmail.com",
            password: "Password1!",
            lastPassword: "Password1!",
            passRec: "",
            verified: true,
            uses: 0,
            createAt: new Date(),
            changeDate: new Date(),
            changeUser: null,
            changeType: "create",
            ver: 1,
            isDeleted: false,
            changeHistory: [],
          },
          {
            name: "Lynx Pardelle",
            roleType: "special",
            generalRole: "administrador",
            tickets: [],
            email: "lynxpardelle@lynxpardelle.com",
            password: process.env.SECRET,
            lastPassword: process.env.SECRET,
            passRec: "",
            verified: true,
            uses: 0,
            createAt: new Date(),
            changeDate: new Date(),
            changeUser: null,
            changeType: "create",
            ver: 1,
            isDeleted: false,
            changeHistory: [],
          },
        ];
        let newUsersCreated = newUsers.map(async (user: any) => {
          return UserController.DoCreateUser(user);
        });
        if (newUsersCreated.length !== 2) {
          throw new Error(
            "No se crearon los usuarios necesarios para manejar la app."
          );
        }
        const newMain = new Main();
        newMain.title = "Agenda de Eventos";
        newMain.welcome = "Te damos la bienvenida a Agenda de Eventos";
        newMain.errorMsg =
          "Ocurrió un problema con la carga de la página solicitada.";
        main = await newMain.save();
        if (main === null) {
          throw new Error("No hay main.");
        }
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
