"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Modules */
const express_1 = require("express");
const main_1 = require("../controllers/main");
const router = (0, express_1.Router)();
/* Test Routes */
router.get("/datos-autor", main_1.MainController.datosAutor);
/* Create */
/* Read */
router.get("/main", main_1.MainController.getMain);
/* Update */
/* Delete */
/* Files */
exports.default = router;
