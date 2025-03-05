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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Modules */
const express_1 = require("express");
const evento_1 = require("../controllers/evento");
const multer_1 = __importDefault(require("multer"));
const authenticated_1 = require("../middlewares/authenticated");
const md_role = __importStar(require("../middlewares/is_role"));
const router = (0, express_1.Router)();
const md_upload = (0, multer_1.default)({ dest: "./uploads/evento" }).any();
/* Test Routes */
router.get("/datos-autor", evento_1.EventoController.datosAutor);
/* Create */
router.post("/activity/:id", authenticated_1.ensureAuth, evento_1.EventoController.createActivity);
router.post("/calification/:type/:id", authenticated_1.ensureAuth, evento_1.EventoController.createCalification);
router.post("/evento", authenticated_1.ensureAuth, evento_1.EventoController.createEvento);
router.post("/ticket/:userId/:eventoId", authenticated_1.ensureAuth, evento_1.EventoController.createTicket);
/* Read */
router.get("/evento/:id", authenticated_1.optionalAuth, evento_1.EventoController.getEvento);
router.get("/eventos/:page?/:limit?/:sort?/:type?/:search?", authenticated_1.optionalAuth, evento_1.EventoController.getEventos);
router.get("/activity/:id/:firstOpen?", authenticated_1.optionalAuth, evento_1.EventoController.viewActivity);
/* Update & Delete */
router.put("/activity/:type", [authenticated_1.ensureAuth, md_role.isOperador], evento_1.EventoController.updateActivity);
router.put("/calification/:type", [authenticated_1.ensureAuth, md_role.isOperador], evento_1.EventoController.updateCalification);
router.put("/evento/:type", [authenticated_1.ensureAuth, md_role.isOperador], evento_1.EventoController.updateEvento);
router.put("/ticket/:type", [authenticated_1.ensureAuth, md_role.isOperador], evento_1.EventoController.updateTicket);
/* Files */
router.post("/files/:typeObj/:type/:id", [authenticated_1.ensureAuth, md_upload], evento_1.EventoController.UploadFiles);
router.delete("/file/:typeObj/:type/:idObj/:id", authenticated_1.ensureAuth, evento_1.EventoController.deleteFile);
router.get("/file/:file", evento_1.EventoController.getFile);
exports.default = router;
