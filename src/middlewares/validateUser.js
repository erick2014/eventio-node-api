const { Users } = require("../models/associations.js");

async function validateIfUserExist (req, res, next) {
  try {
    const userId  = req.idDecoded;

    if(!userId){
      const error = new Error("User Id is required");
      error.statusCode = 403;
      throw error
    }
    
    let user = await Users.findOne({ 
      where : { id: userId }
    })
  
    if(!user){
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error
    }
    next()
  } catch (error) {
    next(error);
  }
}

module.exports = { validateIfUserExist }