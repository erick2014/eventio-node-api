const { Users } = require("../models/usersModel.js");

class UsersController {
  createUser({ firstName, lastName, email, password }) {
    console.log("here...");
    const user = Users.create({
      firstName,
      lastName,
      email,
      password,
    });
    console.log("user found ? ", user);
    return user;
  }

  async loginUser({ email, password }) {
    const userLogin = await Users.findOne({
      where: { email: email, password: password },
      raw: true,
    });

    if (!userLogin) {
      throw new Error("Invalid email or password");
    }

    return {
      firstName: userLogin.firstName,
      lastName: userLogin.lastName,
      email: userLogin.email,
    };
  }

  async deleteUsersInDbCopy() {
    await Users.destroy({ where: {} });
  }
}

module.exports = UsersController;
