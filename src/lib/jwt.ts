import jwt from "jwt-simple";
import moment from "moment";
import { IUser } from "../schemas/user";
export default {
  createToken(user: IUser): string {
    return jwt.encode(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        generalRole: user.generalRole,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix,
      },
      process.env.SECRET ? process.env.SECRET : ""
    );
  },
};
