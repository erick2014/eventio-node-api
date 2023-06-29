const { Users } = require("../models/usersModel.js");

class UsersController {
  createUser({ firstName, lastName, email, password }) {
    console.log("here...")
    const user = Users.create({
      firstName,
      lastName,
      email,
      password,
    });
    console.log("user found ? ",user)
    return user;
  }

  async loginUser({ email, password }) {
    const userLogin = await Users.findOne({
      where: { email: email, password: password },
    });
    const userAsJson = userLogin.get({plain:true}) 
    return{
      firstName: userAsJson.name,
      lastName: userAsJson.lastName,
      email: userAsJson.email
    }
  }
}

module.exports = UsersController;
