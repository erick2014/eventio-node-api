const { Router } = require("express");
const EventsController = require("../controllers/eventController.js");
const {
  createEventSchema,
  validateRequestEvent,
} = require("../routes/validateDataEvent.js");

const eventRouter = Router();
const eventsController = new EventsController();

eventRouter.post(
  "/",
  validateRequestEvent(createEventSchema),
  async (req, res, next) => {
    const {
      title,
      description,
      event_date,
      event_time,
      capacity_people_event,
    } = req.body;

    try {
      const newEvent = await eventsController.createEvent({
        title,
        description,
        event_date,
        event_time,
        capacity_people_event,
      });

      res.json(newEvent);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = eventRouter;
