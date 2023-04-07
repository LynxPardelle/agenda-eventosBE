"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Modules */
const express_1 = require("express");
const main_1 = require("../controllers/main");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const md_upload = (0, multer_1.default)({ dest: "./uploads" }).any();
/* Test Routes */
router.get("/datos-autor", main_1.MainController.datosAutor);
/* Create */
/* Read */
router.get("/main", main_1.MainController.getMain);
/* Update */
/* Delete */
/* Files */
exports.default = router;
