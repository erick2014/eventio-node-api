import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import {
  validateRequest,
  createUserSchema,
  loginUserSchema,
} from "./validateData.js";

const userRouter = Router();
const userController = new UsersController();

userRouter.post(
  "/signup",
  validateRequest(createUserSchema),
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

export default userRouter;
