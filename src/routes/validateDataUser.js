import Joi from "joi";

const createUserSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  lastName: Joi.string().required().label("LastName"),
  email: Joi.string().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

const loginUserSchema = Joi.object({
  email: Joi.string().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

const validateDataUser = (req, res, next) => {
  const url = req.originalUrl;
  let schemaToUse;

  if (url === "/auth/signup") {
    schemaToUse = createUserSchema;
  } else if (url === "/auth/login") {
    schemaToUse = loginUserSchema;
  }

  const { error } = schemaToUse.validate(req.body, { abortEarly: false });

  if (!error) {
    next();
  } else {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    res.status(400).json({
      error: errorMessage,
    });
  }
};

export { validateDataUser };
