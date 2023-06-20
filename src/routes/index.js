import { Router } from "express";
import shopRoutes from "./shop.js";
import userRouter from "./auth.js";

const mainRouter = Router();

mainRouter.use("/shop", shopRoutes);
mainRouter.use("/auth", userRouter);

export default mainRouter;
