"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuth = ensureAuth;
exports.optionalAuth = optionalAuth;
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const moment_1 = __importDefault(require("moment"));
const secret = process.env.SECRET ? process.env.SECRET : "";
function ensureAuth(req, res, next) {
    if (!req.headers['authorization']) {
        res
            .status(403)
            .send({ message: "La petición no tiene la cabecera de autenticación." });
    }
    else {
        const token = req.headers['authorization'].replace(/['"]+/g, "");
        try {
            const payload = jwt_simple_1.default.decode(token, secret);
            if (payload.exp <= (0, moment_1.default)().unix()) {
                res.status(401).send({
                    message: "El token ha expirado",
                });
            }
            req.user = payload;
        }
        catch (e) {
            res.status(404).send({
                message: "El token no es válido",
            });
        }
        next();
    }
}
function optionalAuth(req, res, next) {
    if (req && req.headers && req.headers['authorization']) {
        const token = req.headers['authorization'].replace(/['"]+/g, "");
        try {
            const payload = jwt_simple_1.default.decode(token, secret);
            if (payload.exp <= (0, moment_1.default)().unix()) {
                res.status(401).send({
                    message: "El token ha expirado",
                });
            }
            req.user = payload;
        }
        catch (e) {
            res.status(404).send({
                message: "El token no es válido",
            });
        }
        next();
    }
    else {
        next();
    }
}
