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
      const dataLogin = await userController.createUser(req.body);
      const newUser = dataLogin.user
      const accessToken = dataLogin.token

      res.json({newUser, accessToken});
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/login",
  validateRequest(loginUserSchema),
  async (req, res, next) => {

    try {
      const dataFound = await userController.loginUser(req.body);
      const userFound = dataFound.dataUser
      const accessToken = dataFound.token
      

      res.json({userFound, accessToken});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
