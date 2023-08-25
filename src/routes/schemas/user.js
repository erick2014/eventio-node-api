const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().required().label("FirstName"),
  lastName: Joi.string().required().label("LastName"),
  email: Joi.string().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

module.exports ={
  createUserSchema
}