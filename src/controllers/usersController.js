import { Users } from "../models/usersModel.js";

class UsersController {
  createUser({ firstName, lastName, email, password }) {
    const user = Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    return user;
  }
}

export default UsersController;
