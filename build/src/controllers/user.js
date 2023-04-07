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
exports.UserController = void 0;
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const populate_1 = __importDefault(require("../lib/populate"));
/* Schemas */
const user_1 = __importDefault(require("../schemas/user"));
const userHistory_1 = __importDefault(require("../schemas/userHistory"));
// Services
const utility_1 = __importDefault(require("../lib/utility"));
const mail_1 = __importDefault(require("../lib/mail"));
const jwt_1 = __importDefault(require("../lib/jwt"));
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
exports.UserController = {
    /* Test */
    datosAutor: (req, res) => {
        return res.status(200).send({
            autor: "Lynx Pardelle",
            url: "https://www.lynxpardelle.com",
        });
    },
    /* Create */
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield exports.UserController.DoCreateUser(req.body, req.user);
                if (!userData || !userData.user) {
                    throw new Error("No se creó el usuario.");
                }
                return res.status(201).send({
                    status: "success",
                    user: userData.user,
                    password: userData.password,
                    token: jwt_1.default.createToken(userData.user),
                });
            }
            catch (error) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al crear el usuario.",
                    errorMessage: error.message,
                    error,
                });
            }
        });
    },
    /* Read */
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const page = req.params.page ? parseInt(req.params.page) : 1;
                const limit = req.params.limit ? parseInt(req.params.limit) : 10;
                const sort = req.params.sort ? req.params.sort : "_id";
                const search = req.params.search ? req.params.search : "";
                const type = req.params.type ? req.params.type : "all";
                let users = yield exports.UserController.DoGetUsers(yield utility_1.default.parseSearcher(type, search, req.user ? req.user : null), page, limit, sort);
                if (!users || !users.users) {
                    nError = 404;
                    throw new Error("No hay usuarios.");
                }
                for (let user of users.users) {
                    user = yield utility_1.default.deletePasswordFields(user);
                }
                return res.status(200).send({
                    status: "success",
                    total_items: users.total,
                    pages: users.pages,
                    users: users.users,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver usuarios.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                let user = yield exports.UserController.DoGetUserByAnything({
                    [req.params.filter]: req.params.id,
                });
                if (user === null) {
                    nError = 404;
                    throw new Error("No hay usuario.");
                }
                user = yield utility_1.default.deletePasswordFields(user);
                return res.status(200).send({
                    status: "success",
                    user: user,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al usuario.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    /* Update & Delete */
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                const body = req.body;
                const type = req.params.type ? req.params.type : "update";
                if (yield exports.UserController.inValidateUser(body)) {
                    throw new Error("Faltan datos.");
                }
                // Recoger el id de la url
                let user = yield exports.UserController.DoGetUserByAnything({
                    _id: body._id,
                });
                if (user === null) {
                    nError = 404;
                    throw new Error("No hay usuario.");
                }
                const check = yield bcrypt_1.default.compare(body.lastPassword, user.password ? user.password : "");
                if (!check &&
                    (!req.user ||
                        !["operador", "administrador", "técnico"].includes(req.user.generalRole))) {
                    nError = 403;
                    throw new Error("No tienes permiso.");
                }
                if (body.password !== "") {
                    const hash = yield bcrypt_1.default.hash(body.password, 5);
                    user.password = hash;
                    user.lastPassword = user.password;
                }
                for (let element in body) {
                    if (element !== "_id" &&
                        (element !== "password" || body.password !== "") &&
                        (element !== "lastPassword" || body.lastPassword !== "")) {
                        user[element] = body[element];
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
                user = yield exports.UserController.DoUpdateUser(user);
                user = yield utility_1.default.deletePasswordFields(user);
                const mail = {
                    title: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} el usuario ${user.name}.`,
                    text: `Se ${type === "delete"
                        ? "eliminó"
                        : type === "restore"
                            ? "restauro"
                            : "actualizó"} el usuario ${user.name}.`,
                    html: `
        <p>
          Puedes ver el usuario en este link:
          <a href="${domain}/usuario/${user._id}" >
            ${domain}/usuario/${user._id}
          <a>
        </p>`,
                };
                const mails = [
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: user.email }, mail),
                ];
                mail_1.default.DoSendEmail(mails);
                return res.status(200).send({
                    status: "success",
                    user: user,
                });
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al usuario.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    /* Login */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nError = 500;
            try {
                // Recoger el id de la url
                const body = req.body;
                // Buscar usuario
                let user = yield exports.UserController.DoGetUserByAnything({
                    email: body.email.toLowerCase(),
                });
                if (!user) {
                    nError = 404;
                    throw new Error("No hay usuario.");
                }
                // Check Password
                const check = yield bcrypt_1.default.compare(body.password, (user === null || user === void 0 ? void 0 : user.password) ? user.password : "");
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
                user.changeUser = user._id;
                user.changeType = "login";
                user.uses++;
                user.ver++;
                let userUpdated = yield exports.UserController.DoUpdateUser(user);
                if (!userUpdated) {
                    nError = 500;
                    throw new Error("Hubo un error al registrar el inicio de sesión.");
                }
                userUpdated = yield utility_1.default.deletePasswordFields(user);
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
                let newRes = {
                    status: "success",
                    user: userUpdated,
                };
                if (!!body.gettoken) {
                    newRes.token = jwt_1.default.createToken(userUpdated);
                }
                return res.status(200).send(newRes);
            }
            catch (err) {
                return res.status(nError).send({
                    status: "error",
                    message: "Error al devolver al usuario.",
                    error_message: err.message,
                    err: err,
                });
            }
        });
    },
    /* 2Export */
    /* DoCreate */
    DoCreateUser(user, changeUser = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield exports.UserController.inValidateUser(user)) {
                    throw new Error("Faltan datos");
                }
                let userCheck = yield exports.UserController.DoGetUserByAnything({
                    email: user.email.toLowerCase(),
                });
                if (userCheck !== null) {
                    throw new Error("El usuario no puede registrarse(prueba cambiando el email).");
                }
                const newUser = new user_1.default();
                newUser.roleType = user.roleType;
                newUser.generalRole = user.generalRole;
                newUser.tickets = user.tickets ? user.tickets : [];
                newUser.email = user.email;
                const password = user.password && !validator_1.default.isEmpty(user.password)
                    ? user.password
                    : utility_1.default.Harshify(12);
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
                const hash = yield bcrypt_1.default.hash(password, 2);
                if (!hash) {
                    throw new Error("Error con la contraseña.");
                }
                [newUser.password, newUser.lastPassword] = [hash, hash];
                const userHistory = yield exports.UserController.DoCreateUserHistory(newUser);
                if (!userHistory) {
                    throw new Error("No se guardó el historial del usuario.");
                }
                if (!newUser.changeHistory)
                    newUser.changeHistory = [];
                newUser.changeHistory.push(userHistory._id);
                let userStored = yield newUser.save();
                if (!userStored) {
                    throw new Error("No se guardó el usuario.");
                }
                const mail = {
                    title: `Se creo un nuevo usuario.`,
                    text: `Se creo un nuevo usuario llamado ${userStored.name}.`,
                    html: `
          <p>
            Puedes ver el usuario en este link:
            <a href="${domain}/usuario/${userStored._id}" >
              ${domain}/usuario/${userStored._id}
            <a>
          </p>
          <p>
            La contraseña del usuario es ${password}, recomendamos hacer el cambio de contraseña a la brevedad.
          </p>
        `,
                };
                const mails = [
                    Object.assign({ to: adminMail }, mail),
                    Object.assign({ to: user.email }, mail),
                ];
                mail_1.default.DoSendEmail(mails);
                userStored = yield utility_1.default.deletePasswordFields(userStored);
                return {
                    user: userStored,
                    password: password,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateUserHistory(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userHistory = new userHistory_1.default();
                for (let key in user) {
                    if (userKeys.includes(key)) {
                        userHistory[key] = user[key];
                    }
                }
                if (!userHistory.changeHistory)
                    userHistory.changeHistory = [];
                userHistory.changeHistory.push(userHistory._id);
                const userHistoryStored = yield userHistory.save();
                if (!userHistoryStored) {
                    throw new Error("No se guardó el historial del usuario.");
                }
                return userHistoryStored;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    /* DoGet */
    DoGetUserByAnything(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne(json).populate(populate_1.default.user);
                return user;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoGetUsers(json, page, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.paginate(json, {
                    page: page,
                    limit: limit,
                    sort: sort,
                    populate: populate_1.default.user,
                });
                return {
                    users: users.docs,
                    total: users.total,
                    limit: users.limit,
                    page: users.page,
                    pages: users.pages,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    /* DoUpdate */
    DoUpdateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userHistory = yield exports.UserController.DoCreateUserHistory(user);
                if (!userHistory) {
                    throw new Error("No se guardó el historial del usuario.");
                }
                if (!user.changeHistory)
                    user.changeHistory = [];
                user.changeHistory.push(userHistory._id);
                const userUpdated = yield user_1.default.findByIdAndUpdate(user._id.toHexString(), user, { new: true });
                if (!userUpdated) {
                    throw new Error("No se actualizó el usuario.");
                }
                return userUpdated;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    /* Utility */
    inValidateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationResults = [
                    validator_1.default.isEmpty(user.name),
                    validator_1.default.isEmpty(user.email),
                    validator_1.default.isEmpty(user.roleType),
                    validator_1.default.isEmpty(user.generalRole),
                ];
                return validationResults.some(Boolean);
            }
            catch (error) {
                return true;
            }
        });
    },
};
// export default UserController;
