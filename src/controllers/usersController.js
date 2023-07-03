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

    const existingEmail = await this.findUser(email);
    if (existingEmail) {
      const error = new Error("This user already exists");
      error.statusCode = 400;
      throw error;
    }

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
      const error = new Error("Invalid email or password");
      error.statusCode = 404;
      throw error;
    }

    return {
      firstName: userLogin.firstName,
      lastName: userLogin.lastName,
      email: userLogin.email,
    };
  }

  async deleteAllUsers() {
    await Users.destroy({ where: {} });
  }
}

module.exports = UsersController;
