const { Users } = require("../models/usersModel.js");

class UsersController {
  async findUser(email) {
    const findEmail = await Users.findOne({
      where: { email: email },
    });

    return findEmail;
  }

  async createUser(userData) {
    const { firstName, lastName, email, password } = userData;

    const user = Users.create({
      firstName,
      lastName,
      email,
      password,
    });

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
