const { Router } = require("express");
const userRouter = require("./auth.js");
const eventRouter = require("./events.js");

const mainRouter = Router();

mainRouter.use("/auth", userRouter);
mainRouter.use("/events", eventRouter);

module.exports = mainRouter;
