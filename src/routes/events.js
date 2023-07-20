const { Router } = require("express");
const EventsController = require("../controllers/eventController.js");
const { eventSchema, validateRequest } = require("../routes/validateData.js");

const eventRouter = Router();
const eventsController = new EventsController();

//Oget all events
eventRouter.get("/", async (_, res, next) => {
  try {
    const events = await eventsController.getAllEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
});

//get all user´s events
eventRouter.get("/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    const userEvents = await eventsController.getUserEvents(userId);

    res.json(userEvents);
  } catch (error) {
    next(error);
  }
});

//get an event
eventRouter.post("/:id", async (req, res, next) => {
  const eventId = parseInt(req.params.id);

  try {
    const event = await eventsController.getEvent(eventId);

    res.json(event);
  } catch (error) {
    next(error);
  }
});

//Create an event
eventRouter.post("/", validateRequest(eventSchema), async (req, res, next) => {
  const { title, description, event_date, event_time, capacity, userId } =
    req.body;

  try {
    const newEvent = await eventsController.create({
      title,
      description,
      event_date,
      event_time,
      capacity,
    });

    await eventsController.createRecordInEventsAttendees(newEvent, userId);

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
