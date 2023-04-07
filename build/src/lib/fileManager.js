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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/* Schemas */
const file_1 = __importDefault(require("../schemas/file"));
/* Controlles */
const user_1 = require("../controllers/user");
const _fileManager = {
    uploadFile(file, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extensión y tamaño del fichero
                let fileExt = file.mimetype.split("/")[1];
                let fileSize = file.size;
                let filePath = file.path;
                if (fileExt != "png" &&
                    fileExt != "gif" &&
                    fileExt != "jpg" &&
                    fileExt != "jpeg") {
                    // Borrar el archivo
                    yield (0, fs_1.unlink)(filePath, (err) => {
                        if (err) {
                            throw new Error("Error al borrar archivo.");
                        }
                    });
                    throw new Error("La extensión del archivo no es válida.");
                }
                if (fileSize > 50000000) {
                    // Borrar el archivo
                    yield (0, fs_1.unlink)(filePath, (err) => {
                        if (err) {
                            throw new Error("Error al borrar archivo.");
                        }
                    });
                    throw new Error("El archivo es demasiado grande. (tamaño máximo permitido = 45mb)");
                }
                //Conseguir nombre del archivo
                let cutter = filePath.includes("\\") ? "\\" : "/";
                let fileSplit = filePath.split(cutter);
                let fileName = file.filename;
                let fileOriginalsplit = file.originalname.split(".");
                let newOriginalName = fileOriginalsplit[0] +
                    fileName.slice(0, 2) +
                    fileName.slice(fileName.length - 1, fileName.length) +
                    "." +
                    fileOriginalsplit[1];
                let newName = fileSplit[0] + cutter + fileSplit[1] + cutter + newOriginalName;
                yield (0, fs_1.rename)(filePath, newName, function (err) {
                    if (err) {
                        throw new Error("El archivo NO se ha renombrado correctamente.");
                    }
                });
                let fileParsed = {
                    title: fileOriginalsplit[0],
                    location: newOriginalName,
                    size: fileSize,
                    type: fileExt,
                };
                return fileParsed;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
    DoCreateFile(fileParsed, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Crear el objeto a guardar
            let file = yield new file_1.default();
            // Asignar valores
            file.title = fileParsed.title;
            file.location = fileParsed.location;
            file.size = fileParsed.size;
            file.type = fileParsed.type;
            file.owner = yield user_1.UserController.DoGetUserByAnything({ _id: user._id });
            file.createAt = new Date();
            let fileStored = yield file.save();
            if (!fileStored) {
                throw new Error("El archivo NO se ha guardado.");
            }
            return file;
        });
    },
    DoGetFilesUploadedAndCreated(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            //Recoger el fichero de la petición
            if (!req.files) {
                throw new Error("Archivo no subido...");
            }
            const files = !Array.isArray(req.files)
                ? req.files[Object.keys(req.files)[0]]
                : req.files;
            return Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                return yield _fileManager.DoCreateFile(yield _fileManager.uploadFile(file, user), user);
            })));
        });
    },
    deleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield file_1.default.findById(fileId);
                if (file === null) {
                    throw new Error("No se ha encontrado el archivo.");
                }
                const filePath = path_1.default.join(__dirname, "../uploads/evento", file.location);
                if (!(0, fs_1.existsSync)(filePath)) {
                    throw new Error("No existe el archivo.");
                }
                yield (0, fs_1.unlink)(filePath, (err) => {
                    if (err) {
                        throw new Error("Error al borrar archivo.");
                    }
                });
                return file;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    },
};
exports.default = _fileManager;
