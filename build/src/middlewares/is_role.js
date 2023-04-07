"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTecn = exports.isAdmin = exports.isOperador = void 0;
function isOperador(req, res, next) {
    if (!req.user ||
        !["operador", "administrador", "técnico"].includes(req.user.generalRole)) {
        return res.status(403).send({ message: " No tienes acceso a esta zona" });
    }
    next();
}
exports.isOperador = isOperador;
function isAdmin(req, res, next) {
    if (!req.user ||
        !["administrador", "técnico"].includes(req.user.generalRole)) {
        return res.status(403).send({ message: " No tienes acceso a esta zona" });
    }
    next();
}
exports.isAdmin = isAdmin;
function isTecn(req, res, next) {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.generalRole) !== "técnico") {
        return res.status(403).send({ message: " No tienes acceso a esta zona" });
    }
    next();
}
exports.isTecn = isTecn;
