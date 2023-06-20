import { Router } from "express";
import UsersController from "../controllers/authController.js";
import { validateDataUser } from "./validateDataUser.js";

const userRouter = Router();
const userController = new UsersController();

userRouter.post("/signup", validateDataUser, async (req, res, next) => {
  const { name, lastName, email, password } = req.body;

  try {
    const newUser = await userController.createUser({
      name,
      lastName,
      email,
      password,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.post("/login", validateDataUser, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await userController.loginUser({ email, password });

    res.status(201).json(userFound);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
