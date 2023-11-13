const { Router } = require("express");
const UsersController = require("../controllers/usersController.js");
const {
  validateRequest,
} = require("../middlewares/validateData.js");
const AuthController = require("../controllers/authController.js")

const { createUserSchema } = require("./schemas/user.js")
const { loginUserSchema } = require("./schemas/login.js")

const userRouter = Router();
const userController = new UsersController();
const authController = new AuthController()

userRouter.post(
  "/signup",
  validateRequest(createUserSchema),
  async (req, res, next) => {
    try {
      const newUser = await userController.createUser(req.body);
      const newUserId = newUser.id
      const accessToken = authController.generateAccessToken(newUserId)

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
      const userFound = await userController.loginUser(req.body);
      const idUser = userFound.id
      const accessToken = authController.generateAccessToken(idUser)

      res.json({userFound, accessToken});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
