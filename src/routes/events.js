const { Router } = require("express");
const EventsController = require("../controllers/eventController.js");
const { eventSchema, validateRequest } = require("../routes/validateData.js");

const eventRouter = Router();
const eventsController = new EventsController();

eventRouter.get("/", async (_, res, next) => {
  try {
    const events = await eventsController.getAllEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
});

eventRouter.post("/:id", async (req, res, next) => {
  const eventId = parseInt(req.params.id);

  try {
    const event = await eventsController.getEvent(eventId);

    res.json(event);
  } catch (error) {
    next(error);
  }
});

eventRouter.post("/", validateRequest(eventSchema), async (req, res, next) => {
  const { title, description, event_date, event_time, capacity } = req.body;

  try {
    const newEvent = await eventsController.create({
      title,
      description,
      event_date,
      event_time,
      capacity,
    });

    res.json(newEvent);
  } catch (error) {
    next(error);
  }
});

eventRouter.put(
  "/:id",
  validateRequest(eventSchema),
  async (req, res, next) => {
    const { title, description, event_date, event_time, capacity } = req.body;
    const eventId = parseInt(req.params.id);

    try {
      const eventUpdated = await eventsController.update(
        { title, description, event_date, event_time, capacity },
        eventId
      );

      res.json(eventUpdated);
    } catch (error) {
      next(error);
    }
  }
);

eventRouter.delete("/:id", async (req, res, next) => {
  const eventId = parseInt(req.params.id);

  try {
    const eventDeleted = await eventsController.delete(eventId);

    res.send(eventDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = eventRouter;
