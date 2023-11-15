const { Users } = require("../models/usersModel.js");
const AuthController = require("../controllers/authController.js")
const authController = new AuthController()

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

    const newUser = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    const user = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    }

    const token = authController.generateAccessToken(newUser.id)

    return { user, token };
  }

  async loginUser(userData) {
    const { email, password } = userData
    const userLogin = await Users.findOne({
      where: { email: email },
      raw: true,
    });

    if (!userLogin) {
      const error = new Error("This account is not registered");
      error.statusCode = 401;
      throw error;
    }

    if (userLogin.password !== password) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const dataUser = {
      id: userLogin.id,
      firstName: userLogin.firstName,
      lastName: userLogin.lastName,
      email: userLogin.email,
    }

    const token = authController.generateAccessToken(dataUser.id)

    return { dataUser, token };
  }

  async deleteAllUsers() {
    await Users.destroy({ where: {} });
  }
}

module.exports = UsersController;
