import { Router } from "express";
import userRouter from "./auth.js";

const mainRouter = Router();

mainRouter.use("/auth", userRouter);

export default mainRouter;
