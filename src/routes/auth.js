const { Router } = require("express");
const UsersController = require("../controllers/usersController.js");
const {
  validateRequest,
} = require("../middlewares/validateData.js");

const { createUserSchema } = require("./schemas/user.js")
const { loginUserSchema } = require("./schemas/login.js")

const userRouter = Router();
const userController = new UsersController();

userRouter.post(
  "/signup",
  validateRequest(createUserSchema),
  async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const newUser = await userController.createUser({
        firstName,
        lastName,
        email,
        password,
      });
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/login",
  validateRequest(loginUserSchema),
  async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const userFound = await userController.loginUser({ email, password });

      res.json(userFound);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
