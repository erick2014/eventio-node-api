const jwt = require("jsonwebtoken")

const generateAccessToken = async (idUser) => {  
  try {
    const userId = { idUser }
    const tokenAuthentication = await jwt.sign(userId, process.env.SECRET, {expiresIn: "1h"})
    return tokenAuthentication
  } catch (error) {
    const errorObj = new Error(error);
    errorObj.statusCode = 400;
    next(errorObj);
  }
}

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

const validateAccessToken = async (req, res, next) => {
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

module.exports = { generateAccessToken, validateAccessToken };