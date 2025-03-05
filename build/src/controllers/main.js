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
exports.MainController = void 0;
/* Models */
const main_1 = __importDefault(require("../schemas/main"));
/* Controllers */
const user_1 = require("./user");
/* Env */
const secret = process.env.SECRET ? process.env.SECRET : "";
/* Controller */
exports.MainController = {
    /* Test */
    datosAutor: (req, res) => {
        res.status(200).send({
            autor: "Lynx Pardelle",
            url: "https://www.lynxpardelle.com",
        });
    },
    /* Create */
    /* Read */
    getMain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nErr = 500;
            try {
                let main = yield main_1.default.findOne();
                if (main === null) {
                    let newUsers = [
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
                    let newUsersCreated = newUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                        return user_1.UserController.DoCreateUser(user);
                    }));
                    if (newUsersCreated.length !== 2) {
                        throw new Error("No se crearon los usuarios necesarios para manejar la app.");
                    }
                    const newMain = new main_1.default();
                    newMain.title = "Agenda de Eventos";
                    newMain.welcome = "Te damos la bienvenida a Agenda de Eventos";
                    newMain.errorMsg =
                        "Ocurrió un problema con la carga de la página solicitada.";
                    main = yield newMain.save();
                    if (main === null) {
                        throw new Error("No hay main.");
                    }
                }
                res.status(200).send({
                    status: "success",
                    main: main,
                });
            }
            catch (e) {
                console.log(e);
                res.status(nErr).send({
                    status: "error",
                    message: e.message,
                    e: e,
                });
            }
        });
    },
    /* Update */
    /* Delete */
    /* Files */
};
