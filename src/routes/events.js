const { Router } = require("express");
const { validateRequest } = require("../middlewares/validateData.js");
const { eventSchema,joinEventSchema, eventEditSchema } = require("./schemas/events.js");
const { findUserIsOwnerEvent } = require("../middlewares/validateIsOwner.js")

const EventsController = require("../controllers/eventController.js");
const eventRouter = Router();
const eventsController = new EventsController();

//get an event
eventRouter.get("/event/:eventId", async (req, res, next) => {
  const eventId = parseInt(req.params.eventId);

  try {
    const event = await eventsController.getEvent(eventId);

    res.json(event);
  } catch (error) {
    next(error);
  }
});

//get all events
eventRouter.get("/", async (_, res, next) => {
  try {
    const events = await eventsController.getAllEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
});

//get all user´s events
eventRouter.get("/user/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const userEvents = await eventsController.getUserEvents(userId);

    res.json(userEvents);
  } catch (error) {
    next(error);
  }
});

//join user to an event
eventRouter.post(
  "/join",
  validateRequest(joinEventSchema),
  async (req, res, next) => {
    const { userId, eventId } = req.body;

    try {
      const event = await eventsController.createRecordInEventsAttendees(
        eventId,
        userId,
        false
      );

      res.json(event);
    } catch (error) {
      next(error);
    }
  }
);

//leave of an event
eventRouter.delete(
  "/leave", findUserIsOwnerEvent, async(req, res, next) => {
    try {
      const deleteRecord = await eventsController.deleteRecordFromEventsAttendees(req.body);
      res.send(deleteRecord);
    } catch (error) {
      next(error);
    }
  }
)

//Create an event
eventRouter.post("/", validateRequest(eventSchema), async (req, res, next) => {

  try {
    const newEvent = await eventsController.create(
      req.body
    );

    res.json(newEvent);
  } catch (error) {
    next(error);
  }
});

//update an event
eventRouter.put(
  "/:id",
  validateRequest(eventEditSchema),
  findUserIsOwnerEvent,
  async (req, res, next) => {
    const eventId = parseInt(req.params.id);
    try {
      const eventUpdated = await eventsController.update(
        req.body,
        eventId
      );
      res.json(eventUpdated);
    } catch (error) {
      next(error);
    }
  }
);

//delete an event
eventRouter.delete("/:id", findUserIsOwnerEvent, async (req, res, next) => {
  // debo eliminar tambien el registro de la tabla eventsAttendees
  const eventId = parseInt(req.params.id);

  try {
    const eventDeleted = await eventsController.delete(eventId);

    res.send(eventDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = eventRouter;
