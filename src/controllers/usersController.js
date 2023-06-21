const { Users } = require("../models/usersModel.js");

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

  loginUser({ email, password }) {
    const userLogin = Users.findOne({
      where: { email: email, password: password },
    });

    return userLogin;
  }
}

module.exports = UsersController;
