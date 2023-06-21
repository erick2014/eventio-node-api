const { Router } = require("express");
const userRouter = require("./auth.js");

const mainRouter = Router();

mainRouter.use("/auth", userRouter);

module.exports = mainRouter;
