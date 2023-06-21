import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import AuthController from "../controllers/authController.js";
import {
  validateData,
  createUserSchema,
  loginUserSchema,
} from "./validateData.js";

const userRouter = Router();
const userController = new UsersController();
const authController = new AuthController();

userRouter.post(
  "/signup",
  validateData(createUserSchema),
  async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const newUser = await userController.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      res.json(newUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

userRouter.post(
  "/login",
  validateData(loginUserSchema),
  async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const userFound = await authController.loginUser({ email, password });

      res.json(userFound);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
