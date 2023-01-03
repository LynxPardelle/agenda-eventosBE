import jwt from "jwt-simple";
import moment from "moment";
import secret from "../keys";
const createToken = (user: any) => {
  var payload = {
    sub: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix,
  };
  return jwt.encode(payload, secret);
};
export default createToken;
