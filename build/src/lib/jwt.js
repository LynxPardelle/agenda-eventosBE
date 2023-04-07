"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const moment_1 = __importDefault(require("moment"));
exports.default = {
    createToken(user) {
        return jwt_simple_1.default.encode({
            _id: user._id,
            name: user.name,
            email: user.email,
            generalRole: user.generalRole,
            iat: (0, moment_1.default)().unix(),
            exp: (0, moment_1.default)().add(30, "days").unix,
        }, process.env.SECRET ? process.env.SECRET : "");
    },
};
