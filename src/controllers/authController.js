import { Users } from "../models/usersModel.js";

class AuthController {
  loginUser({ email, password }) {
    const userLogin = Users.findOne({
      where: { email: email, password: password },
    });

    return userLogin;
  }
}

export default AuthController;
