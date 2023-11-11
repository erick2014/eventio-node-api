const jwt = require("jsonwebtoken")
require("../../dotenv.js")

class AuthController {
  generateAccessToken(idUser){
    const userId = { idUser }
    return jwt.sign(userId, process.env.SECRET, {expiresIn: "1h"})
  }
}

module.exports = AuthController;