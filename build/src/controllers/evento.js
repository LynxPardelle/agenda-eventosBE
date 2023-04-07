"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoController = void 0;
const validator_1 = __importDefault(require("validator"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
/* Schemas */
const evento_1 = __importDefault(require("../schemas/evento"));
const activity_1 = __importDefault(require("../schemas/activity"));
const calification_1 = __importDefault(require("../schemas/calification"));
const ticket_1 = __importDefault(require("../schemas/ticket"));
const activityHistory_1 = __importDefault(require("../schemas/activityHistory"));
const eventoHistory_1 = __importDefault(require("../schemas/eventoHistory"));
const ticketHistory_1 = __importDefault(require("../schemas/ticketHistory"));
/* Libs */
const populate_1 = __importDefault(require("../lib/populate"));
const utility_1 = __importDefault(require("../lib/utility"));
const mail_1 = __importDefault(require("../lib/mail"));
const fileManager_1 = __importDefault(require("../lib/fileManager"));
/* Controller */
const user_1 = require("./user");
const witness_1 = __importDefault(require("../schemas/witness"));
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
exports.EventoController = {
    /* Test */
    datosAutor: (req, res) => {
        return res.status(200).send({
            autor: "Lynx Pardelle",
            url: "https://www.lynxpardelle.com",
        });
    },
    /* Create */
    createActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                if (!req.user) {
                    nError = 403;
                    throw new Error("No tienes permiso.");
                }
                const activityStored = yield exports.EventoController.DoCreateActivity(req.body, req.user, req.params.id);
                if (!activityStored) {
                    throw new Error("No se creó la actividad.");
                }
                return res.status(201).send({
                    status: "success",
                    activity: activityStored,
                });
            }
            catch (error) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al crear la actividad.",
                    errorMessage: error.message,
                    error,
                });
            }
        });
    },
    createCalification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                if (!req.user) {
                    nError = 403;
                    throw new Error("No tienes permiso.");
                }
                let user = req.user;
                let obj;
                const typeObj = req.params.type;
                switch (typeObj) {
                    case "evento":
                        obj = yield exports.EventoController.DoGetEventoByAnything({
                            _id: req.params.id,
                        });
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    case "actividad":
                        obj = yield exports.EventoController.DoGetActivityByAnything({
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
                const calificationStored = yield exports.EventoController.DoCreateCalification(req.body, req.user);
                if (!calificationStored) {
                    throw new Error("No se creó la calificación.");
                }
                obj.changeDate = new Date();
                obj.changeUser = user._id;
                obj.changeType = "update";
                obj.uses++;
                obj.ver++;
                if (!obj.califications)
                    obj.califications = [];
                obj.califications.push(calificationStored._id);
                switch (req.params.type) {
                    case "evento":
                        obj = yield exports.EventoController.DoUpdateEvento(obj);
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    case "actividad":
                        obj = yield exports.EventoController.DoUpdateActivity(obj);
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    default:
                        throw new Error("No elegiste ningún tipo de calificación.");
                        break;
                }
                obj = yield utility_1.default.deletePasswordFields(obj);
                const message = `Se han calificado a${typeObj === "evento"
                    ? `l evento ${typeObj}`
                    : ` la actividad ${typeObj}`} ${obj.title}.`;
                const mail = {
                    title: message,
                    text: message,
                    html: `<h1>${message}</h1>
        <p>Puedes ver la calificación <a href="${domain}/${typeObj}/${obj._id}">aquí</a>.</p>`,
                };
                const mails = [
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: `${user.email}` }, mail),
                ];
                if (typeObj === "evento") {
                    const users = obj.asistents.concat(obj.operators);
                    for (let u of users) {
                        mails.push(Object.assign({ to: u.email }, mail));
                    }
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(201).send({
                    status: "success",
                    calification: calificationStored,
                    obj: obj,
                });
            }
            catch (error) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al crear la calificación.",
                    errorMessage: error.message,
                    error,
                });
            }
        });
    },
    createEvento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventoStored = yield exports.EventoController.DoCreateEvento(req.body, req.user);
                if (!eventoStored) {
                    throw new Error("No se creó el evento.");
                }
                return res.status(201).send({
                    status: "success",
                    evento: eventoStored,
                });
            }
            catch (error) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al crear el evento.",
                    errorMessage: error.message,
                    error,
                });
            }
        });
    },
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                if (!req.user) {
                    nError = 403;
                    throw new Error("No tienes permiso.");
                }
                let user = yield user_1.UserController.DoGetUserByAnything({
                    _id: req.params.userId,
                });
                if (!user) {
                    throw new Error("No se encontró el usuario.");
                }
                let evento = yield exports.EventoController.DoGetEventoByAnything({
                    _id: req.params.eventoId,
                });
                if (!evento) {
                    throw new Error("No se encontró el evento.");
                }
                const ticketStored = yield exports.EventoController.DoCreateTicket(req.body, req.user);
                if (!ticketStored) {
                    throw new Error("No se creó el ticket.");
                }
                user.changeDate = new Date();
                user.changeUser = req.user._id;
                user.changeType = "update";
                user.uses++;
                user.ver++;
                if (!user.tickets)
                    user.tickets = [];
                user.tickets.push(ticketStored._id);
                user = yield user_1.UserController.DoUpdateUser(user);
                user = yield utility_1.default.deletePasswordFields(user);
                evento.changeDate = new Date();
                evento.changeUser = req.user._id;
                evento.changeType = "update";
                evento.uses++;
                evento.ver++;
                if (!evento.asistents)
                    evento.asistents = [];
                evento.asistents.push(user._id);
                if (ticketStored.role !== "asistent") {
                    if (!evento.operators)
                        evento.operators = [];
                    evento.operators.push(user._id);
                }
                if (!evento.tickets)
                    evento.tickets = [];
                evento.tickets.push(ticketStored._id);
                evento = yield exports.EventoController.DoUpdateEvento(evento);
                evento = yield utility_1.default.deletePasswordFields(evento);
                const message = `Se ha dado un ticket a ${user.name} para entrar al evento ${evento.title}.`;
                const mail = {
                    title: message,
                    text: message,
                    html: `<h1>${message}</h1>
        <p>Puedes ver el evento <a href="${domain}/evento/${ticketStored.evento._id}">aquí</a>.</p>`,
                };
                const mails = [
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: `${req.user.email}` }, mail),
                ];
                evento.operators.forEach((u) => {
                    mails.push(Object.assign({ to: u.email }, mail));
                });
                mail_1.default.DoSendEmail(mails);
                return res.status(201).send({
                    status: "success",
                    ticket: ticketStored,
                    user: user,
                });
            }
            catch (error) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al crear el ticket.",
                    errorMessage: error.message,
                    error,
                });
            }
        });
    },
    /* Read */
    getEventos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const page = req.params.page ? parseInt(req.params.page) : 1;
                const limit = req.params.limit ? parseInt(req.params.limit) : 10;
                const sort = req.params.sort ? req.params.sort : "_id";
                const search = req.params.search ? req.params.search : "";
                const type = req.params.type ? req.params.type : "all";
                let eventos = yield exports.EventoController.DoGetEventos(yield utility_1.default.parseSearcher(type, search, req.user ? req.user : null), page, limit, sort);
                if (!eventos || !eventos.eventos) {
                    nError = 404;
                    throw new Error("No hay eventos.");
                }
                for (let evento of eventos.eventos) {
                    evento = yield utility_1.default.deletePasswordFields(evento);
                }
                return res.status(200).send({
                    status: "success",
                    total_items: eventos.total,
                    pages: eventos.pages,
                    eventos: eventos.eventos,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver eventos.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    getEvento(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                let evento = yield exports.EventoController.DoGetEventoByAnything({
                    _id: req.params.id,
                });
                if (evento === null) {
                    nError = 404;
                    throw new Error("No hay evento.");
                }
                if (!!req.params.firstOpen) {
                    evento.changeDate = new Date();
                    evento.changeType = "view";
                    evento.ver++;
                    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) {
                        evento.changeUser = yield user_1.UserController.DoGetUserByAnything({
                            _id: req.user._id,
                        })._id;
                        let witness = yield exports.EventoController.DoCreateWitness({ witness: req.user._id }, req.user);
                        if (witness) {
                            if (!evento.witness)
                                evento.witness = [];
                            evento.witness.push(witness);
                        }
                    }
                    evento = yield exports.EventoController.DoUpdateEvento(evento);
                }
                evento = yield utility_1.default.deletePasswordFields(evento);
                return res.status(200).send({
                    status: "success",
                    evento: evento,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al evento.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    viewActivity(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                let activity = yield exports.EventoController.DoGetActivityByAnything({
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
                    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) {
                        activity.changeUser = yield user_1.UserController.DoGetUserByAnything({
                            _id: req.user._id,
                        });
                        let witness = yield exports.EventoController.DoCreateWitness({ witness: req.user._id }, req.user);
                        if (witness) {
                            if (!activity.witness)
                                activity.witness = [];
                            activity.witness.push(witness);
                        }
                    }
                    activity = yield exports.EventoController.DoUpdateEvento(activity);
                }
                activity = yield utility_1.default.deletePasswordFields(activity);
                return res.status(200).send({
                    status: "success",
                    activity: activity,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver la actividad.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    /* Update & Delete */
    updateActivity(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const body = req.body;
                const type = req.params.type ? req.params.type : "update";
                if (yield exports.EventoController.inValidateActivity(body)) {
                    throw new Error("Faltan datos.");
                }
                // Recoger el id de la url
                let activity = yield exports.EventoController.DoGetActivityByAnything({
                    _id: body._id,
                });
                if (activity === null) {
                    nError = 404;
                    throw new Error("No hay actividad.");
                }
                for (let element in body) {
                    if (element !== "_id") {
                        activity[element] = body[element];
                    }
                }
                activity.changeDate = new Date();
                activity.changeUser = yield user_1.UserController.DoGetUserByAnything({
                    _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
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
                activity = yield exports.EventoController.DoUpdateActivity(activity);
                activity = yield utility_1.default.deletePasswordFields(activity);
                const mail = {
                    title: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} la actividad ${activity.name}.`,
                    text: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} la actividad ${activity.name}.`,
                    html: `
        <p>
          Puedes ver la actividad en este link:
          <a href="${domain}/actividad/${activity._id}" >
            ${domain}/actividad/${activity._id}
          <a>
        </p>`,
                };
                const mails = [Object.assign({ to: adminMail }, mail)];
                if (!!req.user) {
                    mails.push(Object.assign({ to: req.user.email }, mail));
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    activity: activity,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al actividad.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    updateCalification(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const body = req.body;
                const type = req.params.type ? req.params.type : "update";
                if (yield exports.EventoController.inValidateCalification(body)) {
                    throw new Error("Faltan datos.");
                }
                // Recoger el id de la url
                let calification = yield exports.EventoController.DoGetCalificationByAnything({
                    _id: body._id,
                });
                if (calification === null) {
                    nError = 404;
                    throw new Error("No hay calificación.");
                }
                for (let element in body) {
                    if (element !== "_id") {
                        calification[element] = body[element];
                    }
                }
                calification.changeDate = new Date();
                calification.changeUser = yield user_1.UserController.DoGetUserByAnything({
                    _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
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
                calification = yield exports.EventoController.DoUpdateCalification(calification);
                calification = yield utility_1.default.deletePasswordFields(calification);
                const mail = {
                    title: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} la calificación ${calification.name}.`,
                    text: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} la calificación ${calification.name}.`,
                    html: `
        <p>
          Puedes ver la calificación en este link:
          <a href="${domain}/calificación/${calification._id}" >
            ${domain}/calificación/${calification._id}
          <a>
        </p>`,
                };
                const mails = [Object.assign({ to: adminMail }, mail)];
                if (!!req.user) {
                    mails.push(Object.assign({ to: req.user.email }, mail));
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    calification: calification,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al calificación.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    updateEvento(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const body = req.body;
                const type = req.params.type ? req.params.type : "update";
                if (yield exports.EventoController.inValidateEvento(body)) {
                    throw new Error("Faltan datos.");
                }
                // Recoger el id de la url
                let evento = yield exports.EventoController.DoGetEventoByAnything({
                    _id: body._id,
                });
                if (evento === null) {
                    nError = 404;
                    throw new Error("No hay evento.");
                }
                for (let element in body) {
                    if (element !== "_id") {
                        evento[element] = body[element];
                    }
                }
                evento.changeDate = new Date();
                evento.changeUser = yield user_1.UserController.DoGetUserByAnything({
                    _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
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
                evento = yield exports.EventoController.DoUpdateEvento(evento);
                evento = yield utility_1.default.deletePasswordFields(evento);
                const mail = {
                    title: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} el evento ${evento.title}.`,
                    text: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} el evento ${evento.title}.`,
                    html: `
        <p>
          Puedes ver el evento en este link:
          <a href="${domain}/evento/${evento._id}" >
            ${domain}/evento/${evento._id}
          <a>
        </p>`,
                };
                const mails = [Object.assign({ to: adminMail }, mail)];
                if (!!req.user) {
                    mails.push(Object.assign({ to: req.user.email }, mail));
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    evento: evento,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al evento.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    updateTicket(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const body = req.body;
                const type = req.params.type ? req.params.type : "update";
                if (yield exports.EventoController.inValidateTicket(body)) {
                    throw new Error("Faltan datos.");
                }
                // Recoger el id de la url
                let ticket = yield exports.EventoController.DoGetTicketByAnything({
                    _id: body._id,
                });
                if (ticket === null) {
                    nError = 404;
                    throw new Error("No hay ticket.");
                }
                for (let element in body) {
                    if (element !== "_id") {
                        ticket[element] = body[element];
                    }
                }
                ticket.changeDate = new Date();
                ticket.changeUser = yield user_1.UserController.DoGetUserByAnything({
                    _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
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
                ticket = yield exports.EventoController.DoUpdateTicket(ticket);
                ticket = yield utility_1.default.deletePasswordFields(ticket);
                const mail = {
                    title: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} el ticket ${ticket.name}.`,
                    text: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} el ticket ${ticket.name}.`,
                    html: `
        <p>
          Puedes ver el ticket en este link:
          <a href="${domain}/ticket/${ticket._id}" >
            ${domain}/ticket/${ticket._id}
          <a>
        </p>`,
                };
                const mails = [Object.assign({ to: adminMail }, mail)];
                if (!!req.user) {
                    mails.push(Object.assign({ to: req.user.email }, mail));
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    ticket: ticket,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al ticket.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    /* Files */
    UploadFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                if (!req.user) {
                    nError = 403;
                    throw new Error("No tienes permiso.");
                }
                let user = req.user;
                let obj;
                const typeObj = req.params.typeObj;
                switch (typeObj) {
                    case "evento":
                        obj = yield exports.EventoController.DoGetEventoByAnything({
                            _id: req.params.id,
                        });
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    case "actividad":
                        obj = yield exports.EventoController.DoGetActivityByAnything({
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
                if (!req.params.type ||
                    !["logo", "headerImage", "photos"].includes(req.params.type)) {
                    throw new Error("No se seleccionó un tipo de archivo válido.");
                }
                const files = yield fileManager_1.default.DoGetFilesUploadedAndCreated(req, user);
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
                        if (!obj.photos)
                            obj.photos = [];
                        obj.photos.push(files[0]._id);
                        break;
                    default: // Esto no podría pasar ya que antes se fijó en esto pero se pone por si acaso.
                        throw new Error("No se seleccionó un tipo de archivo válido.");
                        break;
                }
                switch (typeObj) {
                    case "evento":
                        obj = yield exports.EventoController.DoUpdateEvento(obj);
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    case "actividad":
                        obj = yield exports.EventoController.DoUpdateActivity(obj);
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    default:
                        throw new Error("No elegiste ningún tipo de calificación.");
                        break;
                }
                obj = yield utility_1.default.deletePasswordFields(obj);
                const message = `Se han subido ${files.length} foto${files.length > 1 ? "s" : ""} a${typeObj === "evento"
                    ? `l evento ${typeObj}`
                    : ` la actividad ${typeObj}`} ${obj.title}.`;
                const mail = {
                    title: message,
                    text: message,
                    html: `<h1>${message}</h1>
        <p>Puedes verla <a href="${domain}/${typeObj}/${obj._id}">aquí</a>.</p>`,
                };
                const mails = [
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: `${req.user.email}` }, mail),
                ];
                if (typeObj === "evento") {
                    const users = obj.asistents.concat(obj.operators);
                    for (let u of users) {
                        mails.push(Object.assign({ to: u.email }, mail));
                    }
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    obj: obj,
                    files: files,
                });
            }
            catch (e) {
                return res.status(nError).send({
                    status: "error",
                    message: "El archivo tuvo un error al cargarse.",
                    error_message: e.message,
                    error: e,
                });
            }
        });
    },
    deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                if (!req.user) {
                    nError = 403;
                    throw new Error("No tienes permiso.");
                }
                let user = req.user;
                let obj;
                const typeObj = req.params.typeObj;
                switch (typeObj) {
                    case "evento":
                        obj = yield exports.EventoController.DoGetEventoByAnything({
                            _id: req.params.idObj,
                        });
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    case "actividad":
                        obj = yield exports.EventoController.DoGetActivityByAnything({
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
                if (!req.params.type ||
                    !["logo", "headerImage", "photos"].includes(req.params.type)) {
                    throw new Error("No se seleccionó un tipo de archivo válido.");
                }
                const exFile = yield fileManager_1.default.deleteFile(req.params.id);
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
                        obj = yield exports.EventoController.DoUpdateEvento(obj);
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    case "actividad":
                        obj = yield exports.EventoController.DoUpdateActivity(obj);
                        if (!obj) {
                            throw new Error("No se encontró el evento.");
                        }
                        break;
                    default:
                        throw new Error("No elegiste ningún tipo de calificación.");
                        break;
                }
                obj = yield utility_1.default.deletePasswordFields(obj);
                const message = `Se ha eliminado una foto de${typeObj === "evento"
                    ? `l evento ${typeObj}`
                    : ` la actividad ${typeObj}`} ${obj.title}.`;
                const mail = {
                    title: message,
                    text: message,
                    html: `<h1>${message}</h1>
        <p>Puedes ver ${typeObj === "evento"
                        ? `el evento ${typeObj}`
                        : ` la actividad ${typeObj}`} <a href="${domain}/${typeObj}/${obj._id}">aquí</a>.</p>`,
                };
                const mails = [
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: `${req.user.email}` }, mail),
                ];
                if (typeObj === "evento") {
                    const users = obj.asistents.concat(obj.operators);
                    for (let u of users) {
                        mails.push(Object.assign({ to: u.email }, mail));
                    }
                }
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    obj: obj,
                });
            }
            catch (e) {
                return res.status(nError).send({
                    status: "error",
                    message: "El archivo tuvo un error al borrarse.",
                    error_message: e.message,
                    error: e,
                });
            }
        });
    },
    getFile(req, res) {
        const filePath = path_1.default.join(__dirname, "../../uploads/evento/", req.params.file);
        if (!(0, fs_1.existsSync)(filePath)) {
            return res.status(404).send({ error: "File not found" });
        }
        return res.sendFile(filePath);
    },
    /* 2Export */
    /* DoCreate */
    DoCreateActivityHistory(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let activityHistory = new activityHistory_1.default();
                for (let key in activity) {
                    if (activityKeys.includes(key))
                        activityHistory[key] =
                            activity[key];
                }
                if (!activityHistory.changeHistory)
                    activityHistory.changeHistory = [];
                activityHistory.changeHistory.push(activityHistory._id);
                const activityHistoryStored = yield activityHistory.save();
                if (!activityHistoryStored) {
                    throw new Error("No se guardó el historial de la actividad.");
                }
                return activityHistoryStored;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateEventoHistory(evento) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let eventoHistory = new eventoHistory_1.default();
                for (let key in evento) {
                    if (eventoKeys.includes(key))
                        eventoHistory[key] = evento[key];
                }
                if (!eventoHistory.changeHistory)
                    eventoHistory.changeHistory = [];
                eventoHistory.changeHistory.push(eventoHistory._id);
                const eventoHistoryStored = yield eventoHistory.save();
                if (!eventoHistoryStored) {
                    throw new Error("No se guardó el historial del evento.");
                }
                return eventoHistoryStored;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateTicketHistory(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ticketHistory = new ticketHistory_1.default();
                for (let key in ticket) {
                    if (ticketKeys.includes(key))
                        ticketHistory[key] = ticket[key];
                }
                if (!ticketHistory.changeHistory)
                    ticketHistory.changeHistory = [];
                ticketHistory.changeHistory.push(ticketHistory._id);
                const ticketHistoryStored = yield ticketHistory.save();
                if (!ticketHistoryStored) {
                    throw new Error("No se guardó el historial del ticket.");
                }
                return ticketHistoryStored;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateActivity(activity, changer, eventoID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evento = yield exports.EventoController.DoGetEventoByAnything({
                    _id: eventoID,
                });
                if (!evento) {
                    throw new Error("No se encontró el evento.");
                }
                const userAdmin = yield user_1.UserController.DoGetUserByAnything({
                    _id: changer._id,
                });
                if (!userAdmin) {
                    throw new Error("No se encontró el usuario que administrará.");
                }
                const adminTicket = yield exports.EventoController.DoGetTicketByAnything({
                    user: userAdmin._id,
                    evento: evento._id,
                });
                if (!adminTicket) {
                    throw new Error("No hay ticket del administrador.");
                }
                if (yield exports.EventoController.inValidateActivity(activity)) {
                    throw new Error("Faltan datos");
                }
                const newActivity = new activity_1.default();
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
                newActivity.changeUser = yield user_1.UserController.DoGetUserByAnything({
                    _id: changer._id,
                });
                newActivity.changeType = "create";
                newActivity.ver = 1;
                newActivity.isDeleted = false;
                newActivity.changeHistory = [];
                const activityHistory = yield exports.EventoController.DoCreateActivityHistory(newActivity);
                if (!activityHistory) {
                    throw new Error("No se guardó el historial de la actividad.");
                }
                if (!newActivity.changeHistory)
                    newActivity.changeHistory = [];
                newActivity.changeHistory.push(activityHistory._id);
                const activityStored = yield newActivity.save();
                if (!activityStored) {
                    throw new Error("No se guardó la actividad.");
                }
                evento.changeDate = new Date();
                evento.changeUser = userAdmin._id;
                evento.changeType = "update";
                evento.ver++;
                if (!evento.activities)
                    evento.activities = [];
                evento.activities.push(activityStored);
                const eventoUpdated = yield exports.EventoController.DoUpdateEvento(evento);
                if (!eventoUpdated) {
                    throw new Error("No se actualizó el evento.");
                }
                if (!adminTicket.activitiesAdmin)
                    adminTicket.activitiesAdmin = [];
                adminTicket.activitiesAdmin.push(activityStored._id);
                adminTicket.changeDate = new Date();
                adminTicket.changeUser = userAdmin._id;
                adminTicket.changeType = "update";
                adminTicket.ver++;
                const adminTicketUpdated = yield exports.EventoController.DoUpdateTicket(adminTicket);
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
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: changer.email }, mail),
                ];
                mail_1.default.DoSendEmail(mails);
                const activity2Send = yield utility_1.default.deletePasswordFields(activityStored);
                return activity2Send;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateCalification(calification, changer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield exports.EventoController.inValidateCalification(calification)) {
                    throw new Error("Faltan datos");
                }
                const newCalification = new calification_1.default();
                newCalification.calificator = yield user_1.UserController.DoGetUserByAnything({
                    _id: changer._id,
                });
                newCalification.calification = calification.calification;
                newCalification.comment = calification.comment;
                newCalification.createAt = new Date();
                const calificationStored = yield newCalification.save();
                if (!calificationStored) {
                    throw new Error("No se guardó la calificación.");
                }
                return calificationStored;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateEvento(evento, changer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield exports.EventoController.inValidateEvento(evento)) {
                    throw new Error("Faltan datos");
                }
                const eventoCheck = yield exports.EventoController.DoGetEventoByAnything({
                    email: evento.title.toLowerCase(),
                });
                if (eventoCheck !== null) {
                    throw new Error("El evento no puede registrarse(prueba cambiando el título).");
                }
                const userAdmin = yield user_1.UserController.DoGetUserByAnything({
                    _id: changer._id,
                });
                if (!userAdmin) {
                    throw new Error("No se encontró el usuario que administrará.");
                }
                const newEvento = new evento_1.default();
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
                const eventoStored = yield newEvento.save();
                if (!eventoStored) {
                    throw new Error("No se guardó el evento.");
                }
                const newTicket = yield exports.EventoController.DoCreateTicket({
                    type: evento.ticketTypes,
                    evento: eventoStored._id,
                    user: userAdmin._id,
                    role: "operador general",
                    activitiesAdmin: eventoStored.activities
                        ? eventoStored.activities
                        : [],
                }, changer);
                if (!newTicket) {
                    throw new Error("No se guardó el ticket.");
                }
                if (!eventoStored.tickets)
                    eventoStored.tickets = [];
                eventoStored.tickets.push(newTicket._id);
                const eventoUpdated = yield exports.EventoController.DoUpdateEvento(eventoStored);
                if (!eventoUpdated) {
                    throw new Error("No se guardó el evento.");
                }
                if (!userAdmin.tickets)
                    userAdmin.tickets = [];
                userAdmin.tickets.push(newTicket._id);
                userAdmin.verified = true;
                userAdmin.changeDate = new Date();
                userAdmin.changeUser = userAdmin._id;
                userAdmin.changeType = "update";
                userAdmin.uses++;
                userAdmin.ver++;
                const userUpdated = yield user_1.UserController.DoUpdateUser(userAdmin);
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
                const mails = [Object.assign({ to: adminMail }, mail)];
                if (!!changer) {
                    mails.push(Object.assign({ to: changer.email }, mail));
                }
                mail_1.default.DoSendEmail(mails);
                const evento2Send = yield utility_1.default.deletePasswordFields(eventoUpdated);
                return evento2Send;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateTicket(ticket, changer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield exports.EventoController.inValidateTicket(ticket)) {
                    throw new Error("Faltan datos");
                }
                const newTicket = new ticket_1.default();
                newTicket.type = ticket.type;
                newTicket.evento = ticket.evento;
                newTicket.user = ticket.user;
                newTicket.role = ticket.role ? ticket.role : "asistente";
                newTicket.activitiesAdmin = ticket.activitiesAdmin
                    ? ticket.activitiesAdmin
                    : [];
                newTicket.createAt = new Date();
                newTicket.changeDate = new Date();
                newTicket.changeUser = yield user_1.UserController.DoGetUserByAnything({
                    _id: changer._id,
                });
                newTicket.changeType = "create";
                newTicket.ver = 1;
                newTicket.isDeleted = false;
                newTicket.changeHistory = [];
                const ticketHistory = yield exports.EventoController.DoCreateTicketHistory(newTicket);
                if (!ticketHistory) {
                    throw new Error("No se guardó el historial del ticket.");
                }
                if (!newTicket.changeHistory)
                    newTicket.changeHistory = [];
                newTicket.changeHistory.push(ticketHistory._id);
                const ticketStored = yield newTicket.save();
                if (!ticketStored) {
                    throw new Error("No se guardó el ticket.");
                }
                const ticket2Send = yield utility_1.default.deletePasswordFields(ticketStored);
                return ticket2Send;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateWitness(witness, changer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield exports.EventoController.inValidateWitness(witness)) {
                    throw new Error("Faltan datos");
                }
                const newWitness = new witness_1.default();
                newWitness.witness = yield user_1.UserController.DoGetUserByAnything({
                    _id: changer._id,
                });
                newWitness.createAt = new Date();
                const witnessStored = yield newWitness.save();
                if (!witnessStored) {
                    throw new Error("No se guardó el visto.");
                }
                const witness2Send = yield utility_1.default.deletePasswordFields(witnessStored);
                return witness2Send;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    /* DoGet */
    DoGetActivityByAnything(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield activity_1.default.findOne(json).populate(populate_1.default.activity);
                return activity;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetActivities(json, page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activities = yield activity_1.default.paginate(json, {
                    page: page,
                    limit: limit,
                    sort: sort,
                    populate: populate_1.default.activity,
                });
                return {
                    activities: activities.docs,
                    total: activities.total,
                    limit: activities.limit,
                    page: activities.page,
                    pages: activities.pages,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetCalificationByAnything(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const calification = yield calification_1.default.findOne(json).populate(populate_1.default.calification);
                return calification;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetCalifications(json, page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const califications = yield calification_1.default.paginate(json, {
                    page: page,
                    limit: limit,
                    sort: sort,
                    populate: populate_1.default.calification,
                });
                return {
                    califications: califications.docs,
                    total: califications.total,
                    limit: califications.limit,
                    page: califications.page,
                    pages: califications.pages,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetEventoByAnything(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evento = yield evento_1.default.findOne(json).populate(populate_1.default.evento);
                return evento;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetEventos(json, page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventos = yield evento_1.default.paginate(json, {
                    page: page,
                    limit: limit,
                    sort: sort,
                    populate: populate_1.default.evento,
                });
                return {
                    eventos: eventos.docs,
                    total: eventos.total,
                    limit: eventos.limit,
                    page: eventos.page,
                    pages: eventos.pages,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetTicketByAnything(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield ticket_1.default.findOne(json).populate(populate_1.default.ticket);
                return ticket;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetTickets(json, page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield ticket_1.default.paginate(json, {
                    page: page,
                    limit: limit,
                    sort: sort,
                    populate: populate_1.default.ticket,
                });
                return {
                    tickets: tickets.docs,
                    total: tickets.total,
                    limit: tickets.limit,
                    page: tickets.page,
                    pages: tickets.pages,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetWitnessByAnything(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const witness = yield witness_1.default.findOne(json).populate(populate_1.default.witness);
                return witness;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetWitnesss(json, page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const witnesss = yield witness_1.default.paginate(json, {
                    page: page,
                    limit: limit,
                    sort: sort,
                    populate: populate_1.default.witness,
                });
                return {
                    witnesss: witnesss.docs,
                    total: witnesss.total,
                    limit: witnesss.limit,
                    page: witnesss.page,
                    pages: witnesss.pages,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    /* DoUpdate */
    DoUpdateActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let activityHistory = yield exports.EventoController.DoCreateActivityHistory(activity);
                if (!activityHistory) {
                    throw new Error("No se guardó el historial de la actividad.");
                }
                if (!activity.changeHistory)
                    activity.changeHistory = [];
                activity.changeHistory.push(activityHistory._id);
                const activityUpdate = yield activity_1.default.findByIdAndUpdate(activity._id.toHexString(), activity, {
                    new: true,
                }).populate(populate_1.default.activity);
                if (activityUpdate === null) {
                    throw new Error("No se actualizó la actividad.");
                }
                return activityUpdate;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoUpdateCalification(calification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const calificationUpdate = yield calification_1.default.findByIdAndUpdate(calification._id.toHexString(), calification, {
                    new: true,
                }).populate(populate_1.default.calification);
                if (calificationUpdate === null) {
                    throw new Error("No se actualizó la calificación.");
                }
                return calificationUpdate;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoUpdateEvento(evento) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let eventoHistory = yield exports.EventoController.DoCreateEventoHistory(evento);
                if (!eventoHistory) {
                    throw new Error("No se guardó el historial del evento.");
                }
                if (!evento.changeHistory)
                    evento.changeHistory = [];
                evento.changeHistory.push(eventoHistory._id);
                const eventoUpdate = yield evento_1.default.findByIdAndUpdate(evento._id.toHexString(), evento, { new: true }).populate(populate_1.default.evento);
                if (eventoUpdate === null) {
                    throw new Error("No se actualizó el evento.");
                }
                return eventoUpdate;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoUpdateTicket(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ticketHistory = yield exports.EventoController.DoCreateTicketHistory(ticket);
                if (!ticketHistory) {
                    throw new Error("No se guardó el historial del ticket.");
                }
                if (!ticket.changeHistory)
                    ticket.changeHistory = [];
                ticket.changeHistory.push(ticketHistory._id);
                const ticketUpdate = yield ticket_1.default.findByIdAndUpdate(ticket._id.toHexString(), ticket, {
                    new: true,
                }).populate(populate_1.default.ticket);
                if (ticketUpdate === null) {
                    throw new Error("No se actualizó el ticket.");
                }
                return ticketUpdate;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoUpdateWitness(witness) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const witnessUpdate = yield witness_1.default.findByIdAndUpdate(witness._id.toHexString(), witness, {
                    new: true,
                }).populate(populate_1.default.witness);
                if (witnessUpdate === null) {
                    throw new Error("No se actualizó el visto.");
                }
                return witnessUpdate;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    /* Utility */
    inValidateEvento(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResults = [validator_1.default.isEmpty(obj.title)];
                return validationResults.some(Boolean);
            }
            catch (error) {
                return true;
            }
        });
    },
    inValidateActivity(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResults = [validator_1.default.isEmpty(obj.title)];
                return validationResults.some(Boolean);
            }
            catch (error) {
                return true;
            }
        });
    },
    inValidateTicket(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResults = [obj.type === 0, !obj.evento, !obj.user];
                return validationResults.some(Boolean);
            }
            catch (error) {
                return true;
            }
        });
    },
    inValidateWitness(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResults = [validator_1.default.isEmpty(obj.witness)];
                return validationResults.some(Boolean);
            }
            catch (error) {
                return true;
            }
        });
    },
};
