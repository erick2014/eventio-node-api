const Joi = require("joi");
const loginUserSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

module.exports={
  loginUserSchema
}