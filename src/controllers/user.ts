/* Modules */
import { Request, Response } from "express";
import _v from "validator";
import _b from "bcrypt";
import populate from "../lib/populate";
/* Interfaces */
import { IPayload } from "../interfaces/payload";
/* Schemas */
import User, { IUser } from "../schemas/user";
import UserHistory from "../schemas/userHistory";
// Services
import _utility from "../lib/utility";
import _mail from "../lib/mail";
import _jwt from "../lib/jwt";
/* Env */
const adminMail = process.env.email ? process.env.email : "";
const domain = process.env.domain ? process.env.domain : "";
/* HistoryCheckers */
const userKeys = [
  "name",
  "roleType",
  "generalRole",
  "tickets",
  "email",
  "password",
  "lastPassword",
  "passRec",
  "verified",
  "uses",
  "createAt",
  "changeDate",
  "changeUser",
  "changeType",
  "ver",
  "isDeleted",
  "changeHistory",
];

/* Controller */
export const UserController: any = {
  /* Test */
  datosAutor: (req: Request, res: Response) => {
    res.status(200).send({
      autor: "Lynx Pardelle",
      url: "https://www.lynxpardelle.com",
    });
  },
  /* Create */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = await UserController.DoCreateUser(req.body, (req as any).user as IPayload | null);
      if (!userData || !userData.user) {
        throw new Error("No se creó el usuario.");
      }
      res.status(201).send({
        status: "success",
        user: userData.user,
        password: userData.password,
        token: _jwt.createToken(userData.user),
      });
    } catch (error: any) {
      res.status(500).send({
        status: "error",
        message: "Error al crear el usuario.",
        errorMessage: error.message,
        error,
      });
    }
  },
  /* Read */
  async getUsers(req: Request, res: Response) {
    let nError = 500;
    try {
      const page = req.params.page ? parseInt(req.params.page) : 1;
      const limit = req.params.limit ? parseInt(req.params.limit) : 10;
      const sort = req.params.sort ? req.params.sort : "_id";
      const search = req.params.search ? req.params.search : "";
      const type = req.params.type ? req.params.type : "all";
      let users: any = await UserController.DoGetUsers(
        await _utility.parseSearcher(type, search, (req as any).user ? (req as any).user as IPayload : null),
        page,
        limit,
        sort
      );
      if (!users || !users.users) {
        nError = 404;
        throw new Error("No hay usuarios.");
      }
      for (let user of users.users) {
        user = await _utility.deletePasswordFields(user);
      }
      res.status(200).send({
        status: "success",
        total_items: users.total,
        pages: users.pages,
        users: users.users,
      });
    } catch (err: Error | any) {
      res.status(nError).send({
        status: "error",
        message: "Error al devolver usuarios.",
        error_message: err.message,
        err: err,
      });
    }
  },
  async getUser(req: Request, res: Response) {
    let nError = 500;
    try {
      let user: IUser | null = await UserController.DoGetUserByAnything({
        [req.params.filter]: req.params.id,
      });
      if (user === null) {
        nError = 404;
        throw new Error("No hay usuario.");
      }
      user = await _utility.deletePasswordFields(user);
      res.status(200).send({
        status: "success",
        user: user,
      });
    } catch (err: Error | any) {
      res.status(nError).send({
        status: "error",
        message: "Error al devolver al usuario.",
        error_message: err.message,
        err: err,
      });
    }
  },
  /* Update & Delete */
  async updateUser(req: Request, res: Response) {
    let nError = 500;
    try {
      const body = req.body;
      const type = req.params.type ? req.params.type : "update";
      if (await UserController.inValidateUser(body)) {
        throw new Error("Faltan datos.");
      }
      // Recoger el id de la url
      let user: IUser | null | any = await UserController.DoGetUserByAnything({
        _id: body._id,
      });
      if (user === null) {
        nError = 404;
        throw new Error("No hay usuario.");
      }
      const check = await _b.compare(
        body.lastPassword,
        user.password ? user.password : ""
      );
      if (
        !check &&
        (!(req as any).user ||
          !["operador", "administrador", "técnico"].includes(
            (req as any).user.generalRole
          ))
      ) {
        nError = 403;
        throw new Error("No tienes permiso.");
      }
      if (body.password !== "") {
        const hash = await _b.hash(body.password, 5);
        user.password = hash;
        user.lastPassword = user.password;
      }
      for (let element in body) {
        if (
          element !== "_id" &&
          (element !== "password" || body.password !== "") &&
          (element !== "lastPassword" || body.lastPassword !== "")
        ) {
          user[element as keyof IUser] = body[element];
        }
      }
      user.changeDate = new Date();
      user.changeUser = user._id;
      user.changeType = type;
      user.uses++;
      user.ver++;
      switch (type) {
        case "delete":
          user.isDeleted = true;
          break;
        case " restore":
          user.isDeleted = false;
          break;
        default:
          break;
      }
      user = await UserController.DoUpdateUser(user);
      user = await _utility.deletePasswordFields(user);
      const mail = {
        title: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } el usuario ${user.name}.`,
        text: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } el usuario ${user.name}.`,
        html: `
        <p>
          Puedes ver el usuario en este link:
          <a href="${domain}/user/user/${user._id}" >
            ${domain}/user/user/${user._id}
          <a>
        </p>`,
      };
      const mails = [
        { to: adminMail, ...mail },
        { to: user.email, ...mail },
      ];
      _mail.DoSendEmail(mails);
      res.status(200).send({
        status: "success",
        user: user,
      });
    } catch (err: Error | any) {
      res.status(nError).send({
        status: "error",
        message: "Error al devolver al usuario.",
        error_message: err.message,
        err: err,
      });
    }
  },
  /* Login */
  async login(req: Request, res: Response) {
    let nError = 500;
    try {
      // Recoger el id de la url
      const body = req.body;
      if(!req.body.email || !req.body.password) {
        nError = 400;
        throw new Error("Faltan datos.");
      }
      // Buscar usuario
      let user: IUser | null = await UserController.DoGetUserByAnything({
        email: body.email.toLowerCase(),
      });
      if (!user) {
        nError = 404;
        throw new Error("No hay usuario.");
      }
      // Check Password
      const check = await _b.compare(
        body.password,
        user?.password ? user.password : ""
      );
      if (!check) {
        nError = 403;
        throw new Error("Email o contraseña inválidos.");
      }
      if (user.isDeleted === true) {
        nError = 403;
        throw new Error("Este usuario ha sido eliminado.");
      }
      user.verified = true;
      user.changeDate = new Date();
      user.changeUser = (user._id as IUser);
      user.changeType = "login";
      user.uses++;
      user.ver++;
      let userUpdated = await UserController.DoUpdateUser(user);
      if (!userUpdated) {
        nError = 500;
        throw new Error("Hubo un error al registrar el inicio de sesión.");
      }
      userUpdated = await _utility.deletePasswordFields(user);
      /* const mail = {
        title: `${userUpdated.name} ha iniciado sesión`,
        text: `${userUpdated.name} ha iniciado sesión.`,
        html: `
        <p>
          ${userUpdated.name} ha iniciado sesión.
        </p>`,
      };
      const mails = [
        { to: adminMail, ...mail },
        { to: userUpdated.email, ...mail },
      ];
      _mail.DoSendEmail(mails); */
      let newRes: any = {
        status: "success",
        user: userUpdated,
      };
      if (!!body.gettoken) {
        newRes.token = _jwt.createToken(userUpdated);
      }
      res.status(200).send(newRes);
    } catch (err: Error | any) {
      res.status(nError).send({
        status: "error",
        message: "Error al devolver al usuario.",
        error_message: err.message,
        err: err,
      });
    }
  },
  /* 2Export */
  /* DoCreate */
  async DoCreateUser(user: any, changeUser: IPayload | null = null) {
    try {
      if (await UserController.inValidateUser(user)) {
        throw new Error("Faltan datos");
      }
      let userCheck: IUser | null = await UserController.DoGetUserByAnything({
        email: user.email.toLowerCase(),
      });
      if (userCheck !== null) {
        throw new Error(
          "El usuario no puede registrarse(prueba cambiando el email)."
        );
      }
      const newUser: IUser = new User();
      newUser.roleType = user.roleType;
      newUser.generalRole = user.generalRole;
      newUser.tickets = user.tickets ? user.tickets : [];
      newUser.email = user.email;
      const password: string =
        user.password && !_v.isEmpty(user.password)
          ? user.password
          : _utility.Harshify(12);
      newUser.password = password;
      newUser.lastPassword = password;
      newUser.passRec = "";
      newUser.verified = false;
      newUser.uses = 0;
      newUser.name = user.name;
      newUser.createAt = new Date();
      newUser.changeDate = new Date();
      newUser.changeUser = changeUser
        ? changeUser._id
        : user._id
        ? user._id
        : newUser._id;
      newUser.changeType = "create";
      newUser.ver = 1;
      newUser.isDeleted = false;
      newUser.changeHistory = [];
      // Cifrar contraseña
      const hash = await _b.hash(password, 2);
      if (!hash) {
        throw new Error("Error con la contraseña.");
      }
      [newUser.password, newUser.lastPassword] = [hash, hash];
      const userHistory = await UserController.DoCreateUserHistory(newUser);
      if (!userHistory) {
        throw new Error("No se guardó el historial del usuario.");
      }
      if (!newUser.changeHistory) newUser.changeHistory = [];
      newUser.changeHistory.push(userHistory._id);
      let userStored = await newUser.save();
      if (!userStored) {
        throw new Error("No se guardó el usuario.");
      }
      const mail = {
        title: `Se creo un nuevo usuario.`,
        text: `Se creo un nuevo usuario llamado ${userStored.name}.`,
        html: `
          <p>
            Puedes ver el usuario en este link:
            <a href="${domain}/user/user/${userStored._id}" >
              ${domain}/user/user/${userStored._id}
            <a>
          </p>
          <p>
            La contraseña del usuario es ${password}, recomendamos hacer el cambio de contraseña a la brevedad.
          </p>
        `,
      };
      const mails = [
        { to: adminMail, ...mail },
        { to: user.email, ...mail },
      ];
      _mail.DoSendEmail(mails);
      userStored = await _utility.deletePasswordFields(userStored);
      return {
        user: userStored,
        password: password,
      };
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateUserHistory(user: IUser): Promise<IUser> {
    try {
      let userHistory: any | IUser = new UserHistory();
      for (let key in user) {
        if (userKeys.includes(key)) {
          userHistory[key as keyof IUser] = user[key as keyof IUser];
        }
      }
      if (!userHistory.changeHistory) userHistory.changeHistory = [];
      userHistory.changeHistory.push(userHistory._id);
      const userHistoryStored: IUser = await userHistory.save();
      if (!userHistoryStored) {
        throw new Error("No se guardó el historial del usuario.");
      }
      return userHistoryStored;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  /* DoGet */
  async DoGetUserByAnything(json: any): Promise<any> {
    try {
      const mongoose = require('mongoose');
      if (json._id && !mongoose.Types.ObjectId.isValid(json._id)) {
        throw new Error("El id no es válido.");
      }
      const user = await User.findOne(json).populate(populate.user);
      return user;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetUsers(
    json: any,
    page: number,
    limit: number,
    sort: string
  ): Promise<any> {
    try {
      const users: any = await User.paginate(json, {
        page: page,
        limit: limit,
        sort: sort,
        populate: populate.user,
      });
      return {
        users: users.docs,
        total: users.total,
        limit: users.limit,
        page: users.page,
        pages: users.pages,
      };
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  /* DoUpdate */
  async DoUpdateUser(user: IUser): Promise<IUser> {
    try {
      let userHistory: IUser = await UserController.DoCreateUserHistory(user);
      if (!userHistory) {
        throw new Error("No se guardó el historial del usuario.");
      }
      if (!user.changeHistory) user.changeHistory = [];
      user.changeHistory.push(userHistory._id as IUser);
      const userUpdated: IUser | null = await User.findByIdAndUpdate(
        (user._id as string).toString(),
        user,
        { new: true }
      );
      if (!userUpdated) {
        throw new Error("No se actualizó el usuario.");
      }
      return userUpdated;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  /* Utility */
  async inValidateUser(user: any): Promise<boolean> {
    try {
      const validationResults = [
        _v.isEmpty(user.name),
        _v.isEmpty(user.email),
        _v.isEmpty(user.roleType),
        _v.isEmpty(user.generalRole),
      ];
      return validationResults.some(Boolean);
    } catch (error) {
      return true;
    }
  },
};

// export default UserController;
