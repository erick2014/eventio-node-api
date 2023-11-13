const jwt = require("jsonwebtoken")
require("../../dotenv.js")

const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

async function validateAccessToken (req, res, next) {
  const token = req.headers.authorization

  if(token){
    try {
      const tokenDecoded = await verifyToken(token, process.env.SECRET) 
      req.idDecoded = tokenDecoded.idUser;
      next();
    } catch (error) {
      const errorObj = new Error(error);
      errorObj.statusCode = 403;
      next(errorObj);
    }
  } else {
    next()
  }
}

module.exports = { validateAccessToken }