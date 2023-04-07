import { IPayload } from "../interfaces/payload";
import _v from "validator";

export default {
  Harshify(
    length: number,
    limits:
      | "all"
      | "letters"
      | "numbers"
      | "letters&&numbers"
      | "symbols"
      | "letters&&symbols"
      | "numbers&&symbols" = "all"
  ): string {
    let result = "";
    let characters: string;
    switch (limits) {
      case "all":
        characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -+/*%$#!&/()=.,{}´+¨*[]:;_¡?¿|°";
        break;
      case "letters":
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        break;
      case "numbers":
        characters = "0123456789";
        break;
      case "letters&&numbers":
        characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        break;
      case "symbols":
        characters = "-+/*%$#!&/()=.,{}´+¨*[]:;_¡?¿|°";
        break;
      case "letters&&symbols":
        characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz -+/*%$#!&/()=.,{}´+¨*[]:;_¡?¿|°";
        break;
      case "numbers&&symbols":
        characters = "0123456789 -+/*%$#!&/()=.,{}´+¨*[]:;_¡?¿|°";
        break;
      default:
        characters = "";
        break;
    }
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  },
  async parseSearcher(
    type: string,
    search: string,
    user: IPayload | null = null
  ): Promise<any> {
    let searchParams: any = {};
    if (search !== "") {
      if (_v.isJSON(search)) {
        searchParams = JSON.parse(search);
      } else if (
        type !== "all" &&
        !search.includes("$or") &&
        !search.includes("$and")
      ) {
        searchParams[type] = search.includes("$not")
          ? {
              $not: new RegExp(search.replace("$not", ""), "i"),
            }
          : search.includes("$regex")
          ? new RegExp(search.replace("$regex", ""), "i")
          : search;
      } else if (type !== "all" && search.includes("$and")) {
        searchParams.$and = search.split("$and").map((s: string) => {
          return {
            [type]: s.includes("$not")
              ? {
                  $not: new RegExp(s.replace("$not", ""), "i"),
                }
              : s.includes("$regex")
              ? new RegExp(s.replace("$regex", ""), "i")
              : s,
          };
        });
        if (!user || !["administrador", "técnico"].includes(user.generalRole)) {
          searchParams.$and.push({ isDeleted: false });
        }
      } else if (type !== "all" && search.includes("$or")) {
        searchParams.$or = search.split("$or").map((s: string) => {
          return {
            [type]: s.includes("$not")
              ? {
                  $not: new RegExp(s.replace("$not", ""), "i"),
                }
              : s.includes("$regex")
              ? new RegExp(s.replace("$regex", ""), "i")
              : s,
          };
        });
        if (!user || !["administrador", "técnico"].includes(user.generalRole)) {
          searchParams.isDeleted === false;
        }
      } else if (type === "all" && search !== "") {
        searchParams.$or = ["email", "name"].map((t) => {
          return {
            [t]: search.includes("$not")
              ? {
                  $not: new RegExp(search.replace("$not", ""), "i"),
                }
              : search.includes("$regex")
              ? new RegExp(search.replace("$regex", ""), "i")
              : search,
          };
        });
        if (!user || !["administrador", "técnico"].includes(user.generalRole)) {
          searchParams.isDeleted === false;
        }
      }
    }
    return searchParams;
  },
  async deletePasswordFields(obj: any): Promise<any> {
    /* FIXME: This is a temporary fix to avoid the error "Circular dependency" */
    /*
    if (obj.password) delete obj.password;
    if (obj.lastPassword) delete obj.lastPassword;
    if (obj.changeUser && typeof obj.changeUser !== "string") {
      delete obj.changeUser.password;
      delete obj.changeUser.lastPassword;
    }
    if (
      obj.changeHistory &&
      obj.changeHistory[0] &&
      typeof obj.changeHistory[0] !== "string"
    ) {
      obj.changeHistory = await Promise.all(
        obj.changeHistory.map(async (e: any) => {
          if (e.password) delete e.password;
          if (e.lastPassword) delete e.lastPassword;
          if (e.changeUser && typeof e.changeUser !== "string") {
            delete e.changeUser.password;
            delete e.changeUser.lastPassword;
          }
          return e;
        })
      );
    } */
    /* FIXME: This is a temporary fix to avoid the error "Maximum call stack size exceeded" */
    /*
    if (obj.evento && typeof obj.evento !== "string") {
      obj.evento = await this.deletePasswordFields(obj.evento);
    }
    if (
      obj.asistents &&
      obj.asistents[0] &&
      typeof obj.asistents[0] !== "string"
    ) {
      obj.asistents = await Promise.all(
        obj.asistents.map(async (e: any) => {
          return await this.deletePasswordFields(e);
        })
      );
    }
    if (
      obj.operators &&
      obj.operators[0] &&
      typeof obj.operators[0] !== "string"
    ) {
      obj.operators = await Promise.all(
        obj.operators.map(async (e: any) => {
          return await this.deletePasswordFields(e);
        })
      );
    } */
    return obj;
  },
};
