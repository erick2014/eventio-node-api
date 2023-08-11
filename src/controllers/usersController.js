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
    const userExists = await this.findUser(email);

    if (userExists == null) {
      const error = new Error("User does not exist");
      error.statusCode = 401;
      throw error;
    }

    const userLogin = await Users.findOne({
      where: { email: email, password: password },
      raw: true,
    });

    if (!userLogin) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    return {
      id: userLogin.id,
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
