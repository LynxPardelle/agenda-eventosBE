/* Modules */
import { Request, Response } from "express";
import _v from "validator";
import _b from "bcrypt";
import path from "path";
import { existsSync } from "fs";
/* Interfaces */
import { IRequestWithPayload } from "../interfaces/requestWithPayload";
import { IPayload } from "../interfaces/payload";
/* Schemas */
import Evento, { IEvento } from "../schemas/evento";
import Activity, { IActivity } from "../schemas/activity";
import Calification, { ICalification } from "../schemas/calification";
import Ticket, { ITicket } from "../schemas/ticket";
import ActivityHistory from "../schemas/activityHistory";
import EventoHistory from "../schemas/eventoHistory";
import TicketHistory from "../schemas/ticketHistory";
import { IFile } from "../schemas/file";
/* Libs */
import populate from "../lib/populate";
import _utility from "../lib/utility";
import _mail from "../lib/mail";
import _jwt from "../lib/jwt";
import _fileManager from "../lib/fileManager";
/* Controller */
import { UserController } from "./user";
import Witness, { IWitness } from "../schemas/witness";
import { IUser } from "../schemas/user";
/* Env */
const adminMail = process.env.email ? process.env.email : "";
const domain = process.env.domain ? process.env.domain : "";
/* HistoryCheckers */
const activityKeys = [
  "ticketType",
  "title",
  "subtitle",
  "description",
  "headerImage",
  "photos",
  "califications",
  "witness",
  "date",
  "place",
  "titleColor",
  "textColor",
  "linkColor",
  "bgColor",
];
const calificationKeys = ["calificator", "calification", "comment", "createAt"];
const eventoKeys = [
  "title",
  "subtitle",
  "description",
  "headerImage",
  "photos",
  "califications",
  "witness",
  "date",
  "place",
  "titleColor",
  "textColor",
  "linkColor",
  "bgColor",
];
const ticketKeys = [
  "type",
  "evento",
  "user",
  "role",
  "activitiesAdmin",
  "createAt",
  "changeDate",
  "changeUser",
  "changeType",
  "ver",
  "isDeleted",
  "changeHistory",
];
/* Controller */
export const EventoController: any = {
  /* Test */
  datosAutor: (req: Request, res: Response) => {
    return res.status(200).send({
      autor: "Lynx Pardelle",
      url: "https://www.lynxpardelle.com",
    });
  },
  /* Create */
  async createActivity(
    req: IRequestWithPayload,
    res: Response
  ): Promise<Response> {
    let nError: number = 500;
    try {
      if (!req.user) {
        nError = 403;
        throw new Error("No tienes permiso.");
      }
      const activityStored: IActivity | null =
        await EventoController.DoCreateActivity(
          req.body,
          req.user,
          req.params.id
        );
      if (!activityStored) {
        throw new Error("No se creó la actividad.");
      }
      return res.status(201).send({
        status: "success",
        activity: activityStored,
      });
    } catch (error: any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al crear la actividad.",
        errorMessage: error.message,
        error,
      });
    }
  },
  async createCalification(
    req: IRequestWithPayload,
    res: Response
  ): Promise<Response> {
    let nError: number = 500;
    try {
      if (!req.user) {
        nError = 403;
        throw new Error("No tienes permiso.");
      }
      let user: IPayload = req.user;
      let obj: any;
      const typeObj: string = req.params.type;
      switch (typeObj) {
        case "evento":
          obj = await EventoController.DoGetEventoByAnything({
            _id: req.params.id,
          });
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        case "actividad":
          obj = await EventoController.DoGetActivityByAnything({
            _id: req.params.id,
          });
          if (!obj) {
            throw new Error("No se encontró la actividad.");
          }
          break;
        default:
          throw new Error("No elegiste ningún tipo de calificación.");
          break;
      }
      const calificationStored: ICalification | null =
        await EventoController.DoCreateCalification(req.body, req.user);
      if (!calificationStored) {
        throw new Error("No se creó la calificación.");
      }
      obj.changeDate = new Date();
      obj.changeUser = user._id;
      obj.changeType = "update";
      obj.uses++;
      obj.ver++;
      if (!obj.califications) obj.califications = [];
      obj.califications.push(calificationStored._id);
      switch (req.params.type) {
        case "evento":
          obj = await EventoController.DoUpdateEvento(obj);
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        case "actividad":
          obj = await EventoController.DoUpdateActivity(obj);
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        default:
          throw new Error("No elegiste ningún tipo de calificación.");
          break;
      }
      obj = await _utility.deletePasswordFields(obj);
      const message = `Se han calificado a${
        typeObj === "evento"
          ? `l evento ${typeObj}`
          : ` la actividad ${typeObj}`
      } ${obj.title}.`;
      const mail = {
        title: message,
        text: message,
        html: `<h1>${message}</h1>
        <p>Puedes ver la calificación <a href="${domain}/${typeObj}/${obj._id}">aquí</a>.</p>`,
      };
      const mails = [
        {
          to: adminMail,
          ...mail,
        },
        {
          to: `${user.email}`,
          ...mail,
        },
      ];
      if (typeObj === "evento") {
        const users: IUser[] = obj.asistents.concat(obj.operators);
        for (let u of users) {
          mails.push({ to: u.email, ...mail });
        }
      }
      _mail.DoSendEmail(mails);
      return res.status(201).send({
        status: "success",
        calification: calificationStored,
        obj: obj,
      });
    } catch (error: any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al crear la calificación.",
        errorMessage: error.message,
        error,
      });
    }
  },
  async createEvento(
    req: IRequestWithPayload,
    res: Response
  ): Promise<Response> {
    try {
      const eventoStored: IEvento | null =
        await EventoController.DoCreateEvento(req.body, req.user);
      if (!eventoStored) {
        throw new Error("No se creó el evento.");
      }
      return res.status(201).send({
        status: "success",
        evento: eventoStored,
      });
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: "Error al crear el evento.",
        errorMessage: error.message,
        error,
      });
    }
  },
  async createTicket(
    req: IRequestWithPayload,
    res: Response
  ): Promise<Response> {
    let nError: number = 500;
    try {
      if (!req.user) {
        nError = 403;
        throw new Error("No tienes permiso.");
      }
      let user = await UserController.DoGetUserByAnything({
        _id: req.params.userId,
      });
      if (!user) {
        throw new Error("No se encontró el usuario.");
      }
      let evento = await EventoController.DoGetEventoByAnything({
        _id: req.params.eventoId,
      });
      if (!evento) {
        throw new Error("No se encontró el evento.");
      }
      const ticketStored: ITicket | null =
        await EventoController.DoCreateTicket(req.body, req.user);
      if (!ticketStored) {
        throw new Error("No se creó el ticket.");
      }
      user.changeDate = new Date();
      user.changeUser = req.user._id;
      user.changeType = "update";
      user.uses++;
      user.ver++;
      if (!user.tickets) user.tickets = [];
      user.tickets.push(ticketStored._id);
      user = await UserController.DoUpdateUser(user);
      user = await _utility.deletePasswordFields(user);
      evento.changeDate = new Date();
      evento.changeUser = req.user._id;
      evento.changeType = "update";
      evento.uses++;
      evento.ver++;
      if (!evento.asistents) evento.asistents = [];
      evento.asistents.push(user._id);
      if (ticketStored.role !== "asistent") {
        if (!evento.operators) evento.operators = [];
        evento.operators.push(user._id);
      }
      if (!evento.tickets) evento.tickets = [];
      evento.tickets.push(ticketStored._id);
      evento = await EventoController.DoUpdateEvento(evento);
      evento = await _utility.deletePasswordFields(evento);
      const message = `Se ha dado un ticket a ${user.name} para entrar al evento ${evento.title}.`;
      const mail = {
        title: message,
        text: message,
        html: `<h1>${message}</h1>
        <p>Puedes ver el evento <a href="${domain}/evento/${ticketStored.evento._id}">aquí</a>.</p>`,
      };
      const mails = [
        {
          to: adminMail,
          ...mail,
        },
        {
          to: `${req.user.email}`,
          ...mail,
        },
      ];
      evento.operators.forEach((u: IUser) => {
        mails.push({ to: u.email, ...mail });
      });
      _mail.DoSendEmail(mails);
      return res.status(201).send({
        status: "success",
        ticket: ticketStored,
        user: user,
      });
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: "Error al crear el ticket.",
        errorMessage: error.message,
        error,
      });
    }
  },
  /* Read */
  async getEventos(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      const page = req.params.page ? parseInt(req.params.page) : 1;
      const limit = req.params.limit ? parseInt(req.params.limit) : 10;
      const sort = req.params.sort ? req.params.sort : "_id";
      const search = req.params.search ? req.params.search : "";
      const type = req.params.type ? req.params.type : "all";
      let eventos: any = await EventoController.DoGetEventos(
        await _utility.parseSearcher(type, search, req.user ? req.user : null),
        page,
        limit,
        sort
      );
      if (!eventos || !eventos.eventos) {
        nError = 404;
        throw new Error("No hay eventos.");
      }
      for (let evento of eventos.eventos) {
        evento = await _utility.deletePasswordFields(evento);
      }
      return res.status(200).send({
        status: "success",
        total_items: eventos.total,
        pages: eventos.pages,
        eventos: eventos.eventos,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver eventos.",
        error_message: err.message,
        err: err,
      });
    }
  },
  async getEvento(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      let evento: IEvento | null = await EventoController.DoGetEventoByAnything(
        {
          _id: req.params.id,
        }
      );
      if (evento === null) {
        nError = 404;
        throw new Error("No hay evento.");
      }
      if (!!req.params.firstOpen) {
        evento.changeDate = new Date();
        evento.changeType = "view";
        evento.ver++;
        if (req.user?._id) {
          evento.changeUser = await UserController.DoGetUserByAnything({
            _id: req.user._id,
          })._id;
          let witness = await EventoController.DoCreateWitness(
            { witness: req.user._id },
            req.user
          );
          if (witness) {
            if (!evento.witness) evento.witness = [];
            evento.witness.push(witness);
          }
        }
        evento = await EventoController.DoUpdateEvento(evento);
      }
      evento = await _utility.deletePasswordFields(evento);
      return res.status(200).send({
        status: "success",
        evento: evento,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver al evento.",
        error_message: err.message,
        err: err,
      });
    }
  },
  async viewActivity(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      let activity: IActivity | null =
        await EventoController.DoGetActivityByAnything({
          _id: req.params.id,
        });
      if (activity === null) {
        nError = 404;
        throw new Error("No hay actividad.");
      }
      if (!!req.params.firstOpen) {
        activity.changeDate = new Date();
        activity.changeType = "view";
        activity.ver++;
        if (req.user?._id) {
          activity.changeUser = await UserController.DoGetUserByAnything({
            _id: req.user._id,
          });
          let witness = await EventoController.DoCreateWitness(
            { witness: req.user._id },
            req.user
          );
          if (witness) {
            if (!activity.witness) activity.witness = [];
            activity.witness.push(witness);
          }
        }
        activity = await EventoController.DoUpdateEvento(activity);
      }
      activity = await _utility.deletePasswordFields(activity);
      return res.status(200).send({
        status: "success",
        activity: activity,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver la actividad.",
        error_message: err.message,
        err: err,
      });
    }
  },
  /* Update & Delete */
  async updateActivity(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      const body = req.body;
      const type = req.params.type ? req.params.type : "update";
      if (await EventoController.inValidateActivity(body)) {
        throw new Error("Faltan datos.");
      }
      // Recoger el id de la url
      let activity: IActivity | null | any =
        await EventoController.DoGetActivityByAnything({
          _id: body._id,
        });
      if (activity === null) {
        nError = 404;
        throw new Error("No hay actividad.");
      }
      for (let element in body) {
        if (element !== "_id") {
          activity[element as keyof IActivity] = body[element];
        }
      }
      activity.changeDate = new Date();
      activity.changeUser = await UserController.DoGetUserByAnything({
        _id: req.user?._id,
      });
      activity.changeType = type;
      activity.uses++;
      activity.ver++;
      switch (type) {
        case "delete":
          activity.isDeleted = true;
          break;
        case " restore":
          activity.isDeleted = false;
          break;
        default:
          break;
      }
      activity = await EventoController.DoUpdateActivity(activity);
      activity = await _utility.deletePasswordFields(activity);
      const mail = {
        title: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } la actividad ${activity.name}.`,
        text: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } la actividad ${activity.name}.`,
        html: `
        <p>
          Puedes ver la actividad en este link:
          <a href="${domain}/actividad/${activity._id}" >
            ${domain}/actividad/${activity._id}
          <a>
        </p>`,
      };
      const mails = [{ to: adminMail, ...mail }];
      if (!!req.user) {
        mails.push({ to: req.user.email, ...mail });
      }
      _mail.DoSendEmail(mails);
      return res.status(200).send({
        status: "success",
        activity: activity,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver al actividad.",
        error_message: err.message,
        err: err,
      });
    }
  },
  async updateCalification(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      const body = req.body;
      const type = req.params.type ? req.params.type : "update";
      if (await EventoController.inValidateCalification(body)) {
        throw new Error("Faltan datos.");
      }
      // Recoger el id de la url
      let calification: ICalification | null | any =
        await EventoController.DoGetCalificationByAnything({
          _id: body._id,
        });
      if (calification === null) {
        nError = 404;
        throw new Error("No hay calificación.");
      }
      for (let element in body) {
        if (element !== "_id") {
          calification[element as keyof ICalification] = body[element];
        }
      }
      calification.changeDate = new Date();
      calification.changeUser = await UserController.DoGetUserByAnything({
        _id: req.user?._id,
      });
      calification.changeType = type;
      calification.uses++;
      calification.ver++;
      switch (type) {
        case "delete":
          calification.isDeleted = true;
          break;
        case " restore":
          calification.isDeleted = false;
          break;
        default:
          break;
      }
      calification = await EventoController.DoUpdateCalification(calification);
      calification = await _utility.deletePasswordFields(calification);
      const mail = {
        title: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } la calificación ${calification.name}.`,
        text: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } la calificación ${calification.name}.`,
        html: `
        <p>
          Puedes ver la calificación en este link:
          <a href="${domain}/calificación/${calification._id}" >
            ${domain}/calificación/${calification._id}
          <a>
        </p>`,
      };
      const mails = [{ to: adminMail, ...mail }];
      if (!!req.user) {
        mails.push({ to: req.user.email, ...mail });
      }
      _mail.DoSendEmail(mails);
      return res.status(200).send({
        status: "success",
        calification: calification,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver al calificación.",
        error_message: err.message,
        err: err,
      });
    }
  },
  async updateEvento(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      const body = req.body;
      const type = req.params.type ? req.params.type : "update";
      if (await EventoController.inValidateEvento(body)) {
        throw new Error("Faltan datos.");
      }
      // Recoger el id de la url
      let evento: IEvento | null | any =
        await EventoController.DoGetEventoByAnything({
          _id: body._id,
        });
      if (evento === null) {
        nError = 404;
        throw new Error("No hay evento.");
      }
      for (let element in body) {
        if (element !== "_id") {
          evento[element as keyof IEvento] = body[element];
        }
      }
      evento.changeDate = new Date();
      evento.changeUser = await UserController.DoGetUserByAnything({
        _id: req.user?._id,
      });
      evento.changeType = type;
      evento.uses++;
      evento.ver++;
      switch (type) {
        case "delete":
          evento.isDeleted = true;
          break;
        case " restore":
          evento.isDeleted = false;
          break;
        default:
          break;
      }
      evento = await EventoController.DoUpdateEvento(evento);
      evento = await _utility.deletePasswordFields(evento);
      const mail = {
        title: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } el evento ${evento.title}.`,
        text: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } el evento ${evento.title}.`,
        html: `
        <p>
          Puedes ver el evento en este link:
          <a href="${domain}/evento/${evento._id}" >
            ${domain}/evento/${evento._id}
          <a>
        </p>`,
      };
      const mails = [{ to: adminMail, ...mail }];
      if (!!req.user) {
        mails.push({ to: req.user.email, ...mail });
      }
      _mail.DoSendEmail(mails);
      return res.status(200).send({
        status: "success",
        evento: evento,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver al evento.",
        error_message: err.message,
        err: err,
      });
    }
  },
  async updateTicket(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      const body = req.body;
      const type = req.params.type ? req.params.type : "update";
      if (await EventoController.inValidateTicket(body)) {
        throw new Error("Faltan datos: " + req.body.toString());
      }
      // Recoger el id de la url
      let ticket: ITicket | null | any =
        await EventoController.DoGetTicketByAnything({
          _id: body._id,
        });
      if (ticket === null) {
        nError = 404;
        throw new Error("No hay ticket.");
      }
      for (let element in body) {
        if (element !== "_id") {
          ticket[element as keyof ITicket] = body[element];
        }
      }
      ticket.changeDate = new Date();
      ticket.changeUser = await UserController.DoGetUserByAnything({
        _id: req.user?._id,
      });
      ticket.changeType = type;
      ticket.uses++;
      ticket.ver++;
      switch (type) {
        case "delete":
          ticket.isDeleted = true;
          break;
        case " restore":
          ticket.isDeleted = false;
          break;
        default:
          break;
      }
      ticket = await EventoController.DoUpdateTicket(ticket);
      ticket = await _utility.deletePasswordFields(ticket);
      const mail = {
        title: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } el ticket ${ticket.name}.`,
        text: `Se ${
          type === "delete"
            ? "eliminó"
            : type === "restore"
            ? "restauro"
            : "actualizó"
        } el ticket ${ticket.name}.`,
        html: `
        <p>
          Puedes ver el ticket en este link:
          <a href="${domain}/ticket/${ticket._id}" >
            ${domain}/ticket/${ticket._id}
          <a>
        </p>`,
      };
      const mails = [{ to: adminMail, ...mail }];
      if (!!req.user) {
        mails.push({ to: req.user.email, ...mail });
      }
      _mail.DoSendEmail(mails);
      return res.status(200).send({
        status: "success",
        ticket: ticket,
      });
    } catch (err: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "Error al devolver al ticket.",
        error_message: err.message,
        err: err,
      });
    }
  },
  /* Files */
  async UploadFiles(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      if (!req.user) {
        nError = 403;
        throw new Error("No tienes permiso.");
      }
      let user: IPayload = req.user;
      let obj: any;
      const typeObj = req.params.typeObj;
      switch (typeObj) {
        case "evento":
          obj = await EventoController.DoGetEventoByAnything({
            _id: req.params.id,
          });
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        case "activity":
          obj = await EventoController.DoGetActivityByAnything({
            _id: req.params.id,
          });
          if (!obj) {
            throw new Error("No se encontró la actividad.");
          }
          break;
        default:
          throw new Error("No elegiste ningún tipo de objeto.");
          break;
      }
      if (
        !req.params.type ||
        !["logo", "headerImage", "photos"].includes(req.params.type)
      ) {
        throw new Error("No se seleccionó un tipo de archivo válido.");
      }
      const files: IFile[] = await _fileManager.DoGetFilesUploadedAndCreated(
        req,
        user
      );
      if (!files) {
        throw new Error("No se pudieron guardar los archivos correctamente.");
      }
      obj.changeDate = new Date();
      obj.changeUser = req.user._id;
      obj.changeType = "uploadFile";
      obj.uses++;
      obj.ver++;
      switch (req.params.type) {
        case "logo":
          obj.logo = files[0]._id;
          break;
        case "headerImage":
          obj.headerImage = files[0]._id;
          break;
        case "photos":
          if (!obj.photos) obj.photos = [];
          obj.photos.push(files[0]._id);
          break;
        default: // Esto no podría pasar ya que antes se fijó en esto pero se pone por si acaso.
          throw new Error("No se seleccionó un tipo de archivo válido.");
          break;
      }
      switch (typeObj) {
        case "evento":
          obj = await EventoController.DoUpdateEvento(obj);
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        case "activity":
          obj = await EventoController.DoUpdateActivity(obj);
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        default:
          throw new Error("No elegiste ningún tipo de objeto.");
          break;
      }
      obj = await _utility.deletePasswordFields(obj);
      const message = `Se han subido ${files.length} foto${
        files.length > 1 ? "s" : ""
      } a${
        typeObj === "evento"
          ? `l evento ${typeObj}`
          : ` la actividad ${typeObj}`
      } ${obj.title}.`;
      const mail = {
        title: message,
        text: message,
        html: `<h1>${message}</h1>
        <p>Puedes verla <a href="${domain}/${typeObj}/${obj._id}">aquí</a>.</p>`,
      };
      const mails = [
        {
          to: adminMail,
          ...mail,
        },
        {
          to: `${req.user.email}`,
          ...mail,
        },
      ];
      if (typeObj === "evento") {
        const users: IUser[] = obj.asistents.concat(obj.operators);
        for (let u of users) {
          mails.push({ to: u.email, ...mail });
        }
      }
      _mail.DoSendEmail(mails);
      return res.status(200).send({
        status: "success",
        obj: obj,
        files: files,
      });
    } catch (e: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "El archivo tuvo un error al cargarse.",
        error_message: e.message,
        error: e,
      });
    }
  },
  async deleteFile(req: IRequestWithPayload, res: Response) {
    let nError = 500;
    try {
      if (!req.user) {
        nError = 403;
        throw new Error("No tienes permiso.");
      }
      let user: IPayload = req.user;
      let obj: any;
      const typeObj = req.params.typeObj;
      switch (typeObj) {
        case "evento":
          obj = await EventoController.DoGetEventoByAnything({
            _id: req.params.idObj,
          });
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        case "actividad":
          obj = await EventoController.DoGetActivityByAnything({
            _id: req.params.idObj,
          });
          if (!obj) {
            throw new Error("No se encontró la actividad.");
          }
          break;
        default:
          throw new Error("No elegiste ningún tipo de calificación.");
          break;
      }
      if (
        !req.params.type ||
        !["logo", "headerImage", "photos"].includes(req.params.type)
      ) {
        throw new Error("No se seleccionó un tipo de archivo válido.");
      }
      const exFile: IFile = await _fileManager.deleteFile(req.params.id);
      obj.changeDate = new Date();
      obj.changeUser = req.user._id;
      obj.changeType = "uploadFile";
      obj.uses++;
      obj.ver++;
      switch (req.params.type) {
        case "logo":
          delete obj.logo;
          break;
        case "headerImage":
          delete obj.headerImage;
          break;
        case "photos":
          let i = obj.photos.indexOf(exFile._id);
          if (i >= 0) {
            obj.photos.slice(i, 1);
          }
          break;
        default: // Esto no podría pasar ya que antes se fijó en esto pero se pone por si acaso.
          throw new Error("No se seleccionó un tipo de archivo válido.");
          break;
      }
      switch (typeObj) {
        case "evento":
          obj = await EventoController.DoUpdateEvento(obj);
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        case "actividad":
          obj = await EventoController.DoUpdateActivity(obj);
          if (!obj) {
            throw new Error("No se encontró el evento.");
          }
          break;
        default:
          throw new Error("No elegiste ningún tipo de calificación.");
          break;
      }
      obj = await _utility.deletePasswordFields(obj);
      const message = `Se ha eliminado una foto de${
        typeObj === "evento"
          ? `l evento ${typeObj}`
          : ` la actividad ${typeObj}`
      } ${obj.title}.`;
      const mail = {
        title: message,
        text: message,
        html: `<h1>${message}</h1>
        <p>Puedes ver ${
          typeObj === "evento"
            ? `el evento ${typeObj}`
            : ` la actividad ${typeObj}`
        } <a href="${domain}/${typeObj}/${obj._id}">aquí</a>.</p>`,
      };
      const mails = [
        {
          to: adminMail,
          ...mail,
        },
        {
          to: `${req.user.email}`,
          ...mail,
        },
      ];
      if (typeObj === "evento") {
        const users: IUser[] = obj.asistents.concat(obj.operators);
        for (let u of users) {
          mails.push({ to: u.email, ...mail });
        }
      }
      _mail.DoSendEmail(mails);
      return res.status(200).send({
        status: "success",
        obj: obj,
      });
    } catch (e: Error | any) {
      return res.status(nError).send({
        status: "error",
        message: "El archivo tuvo un error al borrarse.",
        error_message: e.message,
        error: e,
      });
    }
  },
  getFile(req: Request, res: Response) {
    let filePath = path.join(
      __dirname,
      "../../../uploads/evento/",
      req.params.file
    );
    if (!existsSync(filePath)) {
      filePath = path.join(__dirname, "../../uploads/evento/", req.params.file);
      if (!existsSync(filePath)) {
        filePath = path.join(__dirname, "../uploads/evento/", req.params.file);
        if (!existsSync(filePath)) {
          filePath = path.join(__dirname, "./uploads/evento/", req.params.file);
          if (!existsSync(filePath)) {
            return res.status(404).send({ error: "File not found" });
          }
        }
      }
    }
    return res.sendFile(filePath);
  },
  /* 2Export */
  /* DoCreate */
  async DoCreateActivityHistory(activity: IActivity): Promise<IActivity> {
    try {
      let activityHistory: any | IActivity = new ActivityHistory();
      for (let key in activity) {
        if (activityKeys.includes(key))
          activityHistory[key as keyof IActivity] =
            activity[key as keyof IActivity];
      }
      if (!activityHistory.changeHistory) activityHistory.changeHistory = [];
      activityHistory.changeHistory.push(activityHistory._id);
      const activityHistoryStored = await activityHistory.save();
      if (!activityHistoryStored) {
        throw new Error("No se guardó el historial de la actividad.");
      }
      return activityHistoryStored;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateEventoHistory(evento: IEvento): Promise<IEvento> {
    try {
      let eventoHistory: any | IEvento = new EventoHistory();
      for (let key in evento) {
        if (eventoKeys.includes(key))
          eventoHistory[key as keyof IEvento] = evento[key as keyof IEvento];
      }
      if (!eventoHistory.changeHistory) eventoHistory.changeHistory = [];
      eventoHistory.changeHistory.push(eventoHistory._id);
      const eventoHistoryStored = await eventoHistory.save();
      if (!eventoHistoryStored) {
        throw new Error("No se guardó el historial del evento.");
      }
      return eventoHistoryStored;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateTicketHistory(ticket: ITicket): Promise<ITicket> {
    try {
      let ticketHistory: any | ITicket = new TicketHistory();
      for (let key in ticket) {
        if (ticketKeys.includes(key))
          ticketHistory[key as keyof ITicket] = ticket[key as keyof ITicket];
      }
      if (!ticketHistory.changeHistory) ticketHistory.changeHistory = [];
      ticketHistory.changeHistory.push(ticketHistory._id);
      const ticketHistoryStored = await ticketHistory.save();
      if (!ticketHistoryStored) {
        throw new Error("No se guardó el historial del ticket.");
      }
      return ticketHistoryStored;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateActivity(
    activity: IActivity,
    changer: IPayload,
    eventoID: string
  ): Promise<IActivity> {
    try {
      const evento: IEvento | null =
        await EventoController.DoGetEventoByAnything({
          _id: eventoID,
        });
      if (!evento) {
        throw new Error("No se encontró el evento.");
      }
      const userAdmin: IUser | null = await UserController.DoGetUserByAnything({
        _id: changer._id,
      });
      if (!userAdmin) {
        throw new Error("No se encontró el usuario que administrará.");
      }
      const adminTicket: ITicket | null =
        await EventoController.DoGetTicketByAnything({
          user: userAdmin._id,
          evento: evento._id,
        });
      if (!adminTicket) {
        throw new Error("No hay ticket del administrador.");
      }
      if (await EventoController.inValidateActivity(activity)) {
        throw new Error("Faltan datos");
      }
      const newActivity: IActivity = new Activity();
      newActivity.ticketType = activity.ticketType ? activity.ticketType : 0;
      newActivity.title = activity.title;
      newActivity.subtitle = activity.subtitle;
      newActivity.description = activity.description;
      if (activity.headerImage) {
        newActivity.headerImage = activity.headerImage;
      }
      newActivity.photos = activity.photos ? activity.photos : [];
      newActivity.califications = activity.califications
        ? activity.califications
        : [];
      newActivity.califications = activity.califications
        ? activity.califications
        : [];
      newActivity.date = activity.date;
      newActivity.place = activity.place;
      newActivity.titleColor = activity.titleColor;
      newActivity.textColor = activity.textColor;
      newActivity.linkColor = activity.linkColor;
      newActivity.bgColor = activity.bgColor;
      newActivity.createAt = new Date();
      newActivity.changeDate = new Date();
      newActivity.changeUser = await UserController.DoGetUserByAnything({
        _id: changer._id,
      });
      newActivity.changeType = "create";
      newActivity.ver = 1;
      newActivity.isDeleted = false;
      newActivity.changeHistory = [];
      const activityHistory = await EventoController.DoCreateActivityHistory(
        newActivity
      );
      if (!activityHistory) {
        throw new Error("No se guardó el historial de la actividad.");
      }
      if (!newActivity.changeHistory) newActivity.changeHistory = [];
      newActivity.changeHistory.push(activityHistory._id);
      const activityStored = await newActivity.save();
      if (!activityStored) {
        throw new Error("No se guardó la actividad.");
      }
      evento.changeDate = new Date();
      evento.changeUser = userAdmin._id;
      evento.changeType = "update";
      evento.ver++;
      if (!evento.activities) evento.activities = [];
      evento.activities.push(activityStored);
      const eventoUpdated = await EventoController.DoUpdateEvento(evento);
      if (!eventoUpdated) {
        throw new Error("No se actualizó el evento.");
      }
      if (!adminTicket.activitiesAdmin) adminTicket.activitiesAdmin = [];
      adminTicket.activitiesAdmin.push(activityStored._id);
      adminTicket.changeDate = new Date();
      adminTicket.changeUser = userAdmin._id;
      adminTicket.changeType = "update";
      adminTicket.ver++;
      const adminTicketUpdated = await EventoController.DoUpdateTicket(
        adminTicket
      );
      if (!adminTicketUpdated) {
        throw new Error("No se actualizó el ticket.");
      }
      const mail = {
        title: `Se creo una nueva actividad.`,
        text: `Se creo una nueva actividad ${activityStored.title}.`,
        html: `
          <p>
            Puedes ver la actividad en este link:
            <a href="${domain}/evento/evento/${eventoUpdated._id}" >
              ${domain}/evento/evento/${eventoUpdated._id}
            <a>
          </p>
        `,
      };
      const mails = [
        { to: adminMail, ...mail },
        { to: changer.email, ...mail },
      ];
      _mail.DoSendEmail(mails);
      const activity2Send = await _utility.deletePasswordFields(activityStored);
      return activity2Send;
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateCalification(
    calification: any,
    changer: IPayload
  ): Promise<ICalification> {
    try {
      if (await EventoController.inValidateCalification(calification)) {
        throw new Error("Faltan datos");
      }
      const newCalification: ICalification = new Calification();
      newCalification.calificator = await UserController.DoGetUserByAnything({
        _id: changer._id,
      });
      newCalification.calification = calification.calification;
      newCalification.comment = calification.comment;
      newCalification.createAt = new Date();
      const calificationStored = await newCalification.save();
      if (!calificationStored) {
        throw new Error("No se guardó la calificación.");
      }
      return calificationStored;
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateEvento(evento: any, changer: IPayload): Promise<IEvento> {
    try {
      if (await EventoController.inValidateEvento(evento)) {
        throw new Error("Faltan datos");
      }
      const eventoCheck: IEvento | null =
        await EventoController.DoGetEventoByAnything({
          email: evento.title.toLowerCase(),
        });
      if (eventoCheck !== null) {
        throw new Error(
          "El evento no puede registrarse(prueba cambiando el título)."
        );
      }
      const userAdmin: IUser | null = await UserController.DoGetUserByAnything({
        _id: changer._id,
      });
      if (!userAdmin) {
        throw new Error("No se encontró el usuario que administrará.");
      }
      const newEvento: IEvento = new Evento();
      newEvento.logo = evento.logo ? evento.logo : undefined;
      newEvento.headerImage = evento.headerImage
        ? evento.headerImage
        : undefined;
      newEvento.title = evento.title;
      newEvento.subtitle = evento.subtitle;
      newEvento.activities = evento.activities ? evento.activities : [];
      newEvento.califications = evento.califications
        ? evento.califications
        : [];
      newEvento.witness = evento.witness ? evento.witness : [];
      newEvento.asistents = [userAdmin._id];
      newEvento.operators = [userAdmin._id];
      newEvento.ticketTypes = evento.ticketTypes;
      newEvento.photos = [];
      newEvento.date = evento.date ? evento.date : new Date();
      newEvento.place = evento.place;
      newEvento.titleColor = evento.titleColor;
      newEvento.textColor = evento.textColor;
      newEvento.linkColor = evento.linkColor;
      newEvento.bgColor = evento.bgColor;
      newEvento.tickets = [];
      newEvento.createAt = new Date();
      newEvento.changeDate = new Date();
      newEvento.changeUser = userAdmin._id;
      newEvento.changeType = "create";
      newEvento.ver = 1;
      newEvento.isDeleted = false;
      newEvento.changeHistory = [];
      const eventoStored = await newEvento.save();
      if (!eventoStored) {
        throw new Error("No se guardó el evento.");
      }
      const newTicket: ITicket | null = await EventoController.DoCreateTicket(
        {
          type: evento.ticketTypes,
          evento: eventoStored._id,
          user: userAdmin._id,
          role: "operador general",
          activitiesAdmin: eventoStored.activities
            ? eventoStored.activities
            : [],
        },
        changer
      );
      if (!newTicket) {
        throw new Error("No se guardó el ticket.");
      }
      if (!eventoStored.tickets) eventoStored.tickets = [];
      eventoStored.tickets.push(newTicket._id);
      const eventoUpdated = await EventoController.DoUpdateEvento(eventoStored);
      if (!eventoUpdated) {
        throw new Error("No se guardó el evento.");
      }
      if (!userAdmin.tickets) userAdmin.tickets = [];
      userAdmin.tickets.push(newTicket._id);
      userAdmin.verified = true;
      userAdmin.changeDate = new Date();
      userAdmin.changeUser = userAdmin._id;
      userAdmin.changeType = "update";
      userAdmin.uses++;
      userAdmin.ver++;
      const userUpdated = await UserController.DoUpdateUser(userAdmin);
      if (!userUpdated) {
        throw new Error("No se guardó el usuario.");
      }
      const mail = {
        title: `Se creo un nuevo evento.`,
        text: `Se creo un nuevo evento titulado ${eventoUpdated.title}.`,
        html: `
          <p>
            Puedes ver el evento en este link:
            <a href="${domain}/evento/evento/${eventoUpdated._id}" >
              ${domain}/evento/evento/${eventoUpdated._id}
            <a>
          </p>
        `,
      };
      const mails = [{ to: adminMail, ...mail }];
      if (!!changer) {
        mails.push({ to: changer.email, ...mail });
      }
      _mail.DoSendEmail(mails);
      const evento2Send = await _utility.deletePasswordFields(eventoUpdated);
      return evento2Send;
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateTicket(ticket: any, changer: IPayload): Promise<ITicket> {
    try {
      if (await EventoController.inValidateTicket(ticket)) {
        throw new Error("Faltan datos");
      }
      const newTicket: ITicket = new Ticket();
      newTicket.type = ticket.type;
      newTicket.evento = ticket.evento;
      newTicket.user = ticket.user;
      newTicket.role = ticket.role ? ticket.role : "asistente";
      newTicket.activitiesAdmin = ticket.activitiesAdmin
        ? ticket.activitiesAdmin
        : [];
      newTicket.createAt = new Date();
      newTicket.changeDate = new Date();
      newTicket.changeUser = await UserController.DoGetUserByAnything({
        _id: changer._id,
      });
      newTicket.changeType = "create";
      newTicket.ver = 1;
      newTicket.isDeleted = false;
      newTicket.changeHistory = [];
      const ticketHistory = await EventoController.DoCreateTicketHistory(
        newTicket
      );
      if (!ticketHistory) {
        throw new Error("No se guardó el historial del ticket.");
      }
      if (!newTicket.changeHistory) newTicket.changeHistory = [];
      newTicket.changeHistory.push(ticketHistory._id);
      const ticketStored = await newTicket.save();
      if (!ticketStored) {
        throw new Error("No se guardó el ticket.");
      }
      const ticket2Send = await _utility.deletePasswordFields(ticketStored);
      return ticket2Send;
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateWitness(witness: any, changer: IPayload): Promise<IWitness> {
    try {
      if (await EventoController.inValidateWitness(witness)) {
        throw new Error("Faltan datos");
      }
      const newWitness: IWitness = new Witness();
      newWitness.witness = await UserController.DoGetUserByAnything({
        _id: changer._id,
      });
      newWitness.createAt = new Date();
      const witnessStored = await newWitness.save();
      if (!witnessStored) {
        throw new Error("No se guardó el visto.");
      }
      const witness2Send = await _utility.deletePasswordFields(witnessStored);
      return witness2Send;
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  /* DoGet */
  async DoGetActivityByAnything(json: any): Promise<IActivity | null> {
    try {
      const activity = await Activity.findOne(json).populate(populate.activity);
      return activity;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetActivities(
    json: any,
    page: number,
    limit: number,
    sort: string
  ): Promise<{
    activities: IActivity[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }> {
    try {
      const activities: any = await Activity.paginate(json, {
        page: page,
        limit: limit,
        sort: sort,
        populate: populate.activity,
      });
      return {
        activities: activities.docs,
        total: activities.total,
        limit: activities.limit,
        page: activities.page,
        pages: activities.pages,
      };
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetCalificationByAnything(json: any): Promise<ICalification | null> {
    try {
      const calification = await Calification.findOne(json).populate(
        populate.calification
      );
      return calification;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetCalifications(
    json: any,
    page: number,
    limit: number,
    sort: string
  ): Promise<{
    califications: ICalification[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }> {
    try {
      const califications: any = await Calification.paginate(json, {
        page: page,
        limit: limit,
        sort: sort,
        populate: populate.calification,
      });
      return {
        califications: califications.docs,
        total: califications.total,
        limit: califications.limit,
        page: califications.page,
        pages: califications.pages,
      };
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetEventoByAnything(json: any): Promise<IEvento | null> {
    try {
      const evento = await Evento.findOne(json).populate(populate.evento);
      return evento;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetEventos(
    json: any,
    page: number,
    limit: number,
    sort: string
  ): Promise<{
    eventos: IEvento[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }> {
    try {
      const eventos: any = await Evento.paginate(json, {
        page: page,
        limit: limit,
        sort: sort,
        populate: populate.evento,
      });
      return {
        eventos: eventos.docs,
        total: eventos.total,
        limit: eventos.limit,
        page: eventos.page,
        pages: eventos.pages,
      };
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetTicketByAnything(json: any): Promise<ITicket | null> {
    try {
      const ticket = await Ticket.findOne(json).populate(populate.ticket);
      return ticket;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetTickets(
    json: any,
    page: number,
    limit: number,
    sort: string
  ): Promise<{
    tickets: ITicket[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }> {
    try {
      const tickets: any = await Ticket.paginate(json, {
        page: page,
        limit: limit,
        sort: sort,
        populate: populate.ticket,
      });
      return {
        tickets: tickets.docs,
        total: tickets.total,
        limit: tickets.limit,
        page: tickets.page,
        pages: tickets.pages,
      };
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetWitnessByAnything(json: any): Promise<IWitness | null> {
    try {
      const witness = await Witness.findOne(json).populate(populate.witness);
      return witness;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoGetWitnesss(
    json: any,
    page: number,
    limit: number,
    sort: string
  ): Promise<{
    witnesss: IWitness[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }> {
    try {
      const witnesss: any = await Witness.paginate(json, {
        page: page,
        limit: limit,
        sort: sort,
        populate: populate.witness,
      });
      return {
        witnesss: witnesss.docs,
        total: witnesss.total,
        limit: witnesss.limit,
        page: witnesss.page,
        pages: witnesss.pages,
      };
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  /* DoUpdate */
  async DoUpdateActivity(activity: IActivity): Promise<IActivity> {
    try {
      let activityHistory: IActivity =
        await EventoController.DoCreateActivityHistory(activity);
      if (!activityHistory) {
        throw new Error("No se guardó el historial de la actividad.");
      }
      if (!activity.changeHistory) activity.changeHistory = [];
      activity.changeHistory.push(activityHistory._id);
      const activityUpdate: IActivity | null = await Activity.findByIdAndUpdate(
        activity._id.toHexString(),
        activity,
        {
          new: true,
        }
      ).populate(populate.activity);
      if (activityUpdate === null) {
        throw new Error("No se actualizó la actividad.");
      }
      return activityUpdate;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoUpdateCalification(
    calification: ICalification
  ): Promise<ICalification> {
    try {
      const calificationUpdate: ICalification | null =
        await Calification.findByIdAndUpdate(
          calification._id.toHexString(),
          calification,
          {
            new: true,
          }
        ).populate(populate.calification);
      if (calificationUpdate === null) {
        throw new Error("No se actualizó la calificación.");
      }
      return calificationUpdate;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoUpdateEvento(evento: IEvento): Promise<IEvento> {
    try {
      let eventoHistory: IEvento = await EventoController.DoCreateEventoHistory(
        evento
      );
      if (!eventoHistory) {
        throw new Error("No se guardó el historial del evento.");
      }
      if (!evento.changeHistory) evento.changeHistory = [];
      evento.changeHistory.push(eventoHistory._id);
      const eventoUpdate: IEvento | null = await Evento.findByIdAndUpdate(
        evento._id.toHexString(),
        evento,
        { new: true }
      ).populate(populate.evento);
      if (eventoUpdate === null) {
        throw new Error("No se actualizó el evento.");
      }
      return eventoUpdate;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoUpdateTicket(ticket: ITicket): Promise<ITicket> {
    try {
      let ticketHistory: ITicket = await EventoController.DoCreateTicketHistory(
        ticket
      );
      if (!ticketHistory) {
        throw new Error("No se guardó el historial del ticket.");
      }
      if (!ticket.changeHistory) ticket.changeHistory = [];
      ticket.changeHistory.push(ticketHistory._id);
      const ticketUpdate: ITicket | null = await Ticket.findByIdAndUpdate(
        ticket._id.toHexString(),
        ticket,
        {
          new: true,
        }
      ).populate(populate.ticket);
      if (ticketUpdate === null) {
        throw new Error("No se actualizó el ticket.");
      }
      return ticketUpdate;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  async DoUpdateWitness(witness: IWitness): Promise<IWitness> {
    try {
      const witnessUpdate: IWitness | null = await Witness.findByIdAndUpdate(
        witness._id.toHexString(),
        witness,
        {
          new: true,
        }
      ).populate(populate.witness);
      if (witnessUpdate === null) {
        throw new Error("No se actualizó el visto.");
      }
      return witnessUpdate;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
  /* Utility */
  async inValidateEvento(obj: any): Promise<boolean> {
    try {
      const validationResults = [_v.isEmpty(obj.title)];
      return validationResults.some(Boolean);
    } catch (error) {
      return true;
    }
  },
  async inValidateActivity(obj: any): Promise<boolean> {
    try {
      const validationResults = [_v.isEmpty(obj.title)];
      return validationResults.some(Boolean);
    } catch (error) {
      return true;
    }
  },
  async inValidateTicket(obj: any): Promise<boolean> {
    try {
      const validationResults = [obj.type === 0, !obj.evento, !obj.user];
      return validationResults.some(Boolean);
    } catch (error) {
      return true;
    }
  },
  async inValidateWitness(obj: any): Promise<boolean> {
    try {
      const validationResults = [_v.isEmpty(obj.witness)];
      return validationResults.some(Boolean);
    } catch (error) {
      return true;
    }
  },
};
