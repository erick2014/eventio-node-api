import { Users } from "../models/usersModel.js";

class UsersController {
  createUser({ name, lastName, email, password }) {
    const user = Users.create({
      name,
      lastName,
      email,
      password,
    });

    return user;
  }

  loginUser({ email, password }) {
    const userLogin = Users.findOne({
      where: { email: email, password: password },
    });

    return userLogin;
  }
}

export default UsersController;
