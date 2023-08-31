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

  async loginUser(userData) {
    const { email, password } = userData
    const userLogin = await Users.findOne({
      where: { email: email },
      raw: true,
    });

    if (userLogin == null) {
      const error = new Error("This account is not registered");
      error.statusCode = 401;
      throw error;
    }

    if (userLogin.password !== password) {
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
