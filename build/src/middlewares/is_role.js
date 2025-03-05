"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOperador = isOperador;
exports.isAdmin = isAdmin;
exports.isTecn = isTecn;
function isOperador(req, res, next) {
    if (!req.user ||
        !["operador", "administrador", "técnico"].includes(req.user.generalRole)) {
        res.status(403).send({ message: " No tienes acceso a esta zona" });
    }
    else {
        next();
    }
}
function isAdmin(req, res, next) {
    if (!req.user ||
        !["administrador", "técnico"].includes(req.user.generalRole)) {
        res.status(403).send({ message: " No tienes acceso a esta zona" });
    }
    else {
        next();
    }
}
function isTecn(req, res, next) {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.generalRole) !== "técnico") {
        res.status(403).send({ message: " No tienes acceso a esta zona" });
    }
    else {
        next();
    }
}
