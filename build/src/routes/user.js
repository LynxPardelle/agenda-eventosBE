"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* Modules */
const express_1 = require("express");
const user_1 = require("../controllers/user");
const authenticated_1 = require("../middlewares/authenticated");
const md_role = __importStar(require("../middlewares/is_role"));
const router = (0, express_1.Router)();
/* Test Routes */
router.get("/datos-autor", user_1.UserController.datosAutor);
/* Create */
router.post("/user", authenticated_1.optionalAuth, user_1.UserController.createUser);
/* Read */
router.get("/user/:id/:filter", authenticated_1.optionalAuth, user_1.UserController.getUser);
router.get("/users/:page?/:limit?/:sort?/:type?/:search?", [authenticated_1.ensureAuth, md_role.isOperador], user_1.UserController.getUsers);
/* Update & Delete */
router.put("/user/:type", [authenticated_1.ensureAuth, md_role.isOperador], user_1.UserController.updateUser);
/* Login */
router.post("/login", user_1.UserController.login);
exports.default = router;
