"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.ensureAuth = void 0;
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const moment_1 = __importDefault(require("moment"));
const secret = process.env.SECRET ? process.env.SECRET : "";
function ensureAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({ message: "La petición no tiene la cabecera de autenticación." });
    }
    const token = req.headers.authorization.replace(/['"]+/g, "");
    try {
        const payload = jwt_simple_1.default.decode(token, secret);
        if (payload.exp <= (0, moment_1.default)().unix()) {
            return res.status(401).send({
                message: "El token ha expirado",
            });
        }
        req.user = payload;
    }
    catch (e) {
        return res.status(404).send({
            message: "El token no es válido",
        });
    }
    next();
}
exports.ensureAuth = ensureAuth;
function optionalAuth(req, res, next) {
    if (req && req.headers && req.headers.authorization) {
        const token = req.headers.authorization.replace(/['"]+/g, "");
        try {
            const payload = jwt_simple_1.default.decode(token, secret);
            if (payload.exp <= (0, moment_1.default)().unix()) {
                return res.status(401).send({
                    message: "El token ha expirado",
                });
            }
            req.user = payload;
        }
        catch (e) {
            return res.status(404).send({
                message: "El token no es válido",
            });
        }
        next();
    }
    else {
        next();
    }
}
exports.optionalAuth = optionalAuth;
