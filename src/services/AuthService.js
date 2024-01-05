const jwt = require("jsonwebtoken")

const generateAccessToken = async (idUser, expirationTimeToken = "1h") => {  
  try {
    const userId = { idUser }
    const tokenAuthentication = await jwt.sign(userId, process.env.SECRET, { expiresIn: expirationTimeToken })
    return tokenAuthentication
  } catch (error) {
    const errorObj = new Error(error.message);
    errorObj.statusCode = 400;
    throw errorObj
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
    const errorObj = new Error(error.message);
    errorObj.statusCode = 403;
    next(errorObj);
  }
} else {
  next()
}
}

module.exports = { generateAccessToken, validateAccessToken };