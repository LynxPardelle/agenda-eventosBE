import { unlink, rename, existsSync } from "fs";
import { Request } from "express";
import path from "path";
/* Interfaces */
import { IPayload } from "../interfaces/payload";
import { IFileParsed } from "../interfaces/fileParsed";
/* Schemas */
import File, { IFile } from "../schemas/file";
/* Controlles */
import { UserController } from "../controllers/user";

const _fileManager = {
  async uploadFile(
    file: Express.Multer.File,
    user: IPayload
  ): Promise<IFileParsed> {
    try {
      // Extensión y tamaño del fichero
      let fileExt = file.mimetype.split("/")[1];
      let fileSize = file.size;
      let filePath = file.path;
      if (
        fileExt != "png" &&
        fileExt != "gif" &&
        fileExt != "jpg" &&
        fileExt != "jpeg"
      ) {
        // Borrar el archivo
        await unlink(filePath, (err) => {
          if (err) {
            throw new Error("Error al borrar archivo.");
          }
        });
        throw new Error("La extensión del archivo no es válida.");
      }
      if (fileSize > 50000000) {
        // Borrar el archivo
        await unlink(filePath, (err) => {
          if (err) {
            throw new Error("Error al borrar archivo.");
          }
        });
        throw new Error(
          "El archivo es demasiado grande. (tamaño máximo permitido = 45mb)"
        );
      }
      //Conseguir nombre del archivo
      let cutter = filePath.includes("\\") ? "\\" : "/";
      let fileSplit = filePath.split(cutter);
      let fileName = file.filename;
      let fileOriginalsplit = file.originalname.split(".");
      let newOriginalName =
        fileOriginalsplit[0] +
        fileName.slice(0, 2) +
        fileName.slice(fileName.length - 1, fileName.length) +
        "." +
        fileOriginalsplit[1];
      let newName =
        fileSplit[0] + cutter + fileSplit[1] + cutter + newOriginalName;
      await rename(filePath, newName, function (err) {
        if (err) {
          throw new Error("El archivo NO se ha renombrado correctamente.");
        }
      });
      let fileParsed: IFileParsed = {
        title: fileOriginalsplit[0],
        location: newOriginalName,
        size: fileSize,
        type: fileExt,
      };
      return fileParsed;
    } catch (err: Error | any) {
      throw new Error(err.message);
    }
  },
  async DoCreateFile(fileParsed: IFileParsed, user: IPayload): Promise<IFile> {
    // Crear el objeto a guardar
    let file: IFile = await new File();
    // Asignar valores
    file.title = fileParsed.title;
    file.location = fileParsed.location;
    file.size = fileParsed.size;
    file.type = fileParsed.type;
    file.owner = await UserController.DoGetUserByAnything({ _id: user._id });
    file.createAt = new Date();
    let fileStored = await file.save();
    if (!fileStored) {
      throw new Error("El archivo NO se ha guardado.");
    }
    return file;
  },
  async DoGetFilesUploadedAndCreated(
    req: Request | Request,
    user: IPayload
  ): Promise<IFile[]> {
    //Recoger el fichero de la petición
    if (!req.files) {
      throw new Error("Archivo no subido...");
    }
    const files: Express.Multer.File[] = !Array.isArray(req.files)
      ? req.files[Object.keys(req.files)[0]]
      : req.files;
    return Promise.all(
      files.map(async (file) => {
        return await _fileManager.DoCreateFile(
          await _fileManager.uploadFile(file, user),
          user
        );
      })
    );
  },
  async deleteFile(fileId: string): Promise<IFile> {
    try {
      const file: IFile | null = await File.findById(fileId);
      if (file === null) {
        throw new Error("No se ha encontrado el archivo.");
      }
      const filePath = path.join(__dirname, "../uploads/evento", file.location);
      if (!existsSync(filePath)) {
        throw new Error("No existe el archivo.");
      }
      await unlink(filePath, (err) => {
        if (err) {
          throw new Error("Error al borrar archivo.");
        }
      });
      return file;
    } catch (err: Error | unknown | any) {
      throw new Error(err.message);
    }
  },
};

export default _fileManager;
