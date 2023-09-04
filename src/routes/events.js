const { Router } = require("express");
const { validateRequest } = require("../middlewares/validateData.js");
const { eventSchema, joinAndLeaveEventSchema, eventEditSchema } = require("./schemas/events.js");
const { validateIsEventOwner } = require("../middlewares/validateIsOwner.js")
const  { validateLeaveEvent } = require("../middlewares/validateLeaveEvent.js")
const { validateJoinEvent } = require("../middlewares/validateJoinEvent.js")

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
eventRouter.get("/:pageNumber/:itemsPerPage", async (req, res, next) => {
  try {
    const events = await eventsController.getAllEvents(req.params);
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
  validateRequest(joinAndLeaveEventSchema),
  validateJoinEvent,
  async (req, res, next) => {
    const { userId, eventId } = req.body;

    try {
      const joinToEvent = await eventsController.joinEvent(
        eventId,
        userId,
        false
      );

      res.send(joinToEvent);
    } catch (error) {
      next(error);
    }
  }
);

//leave an event
eventRouter.delete(
  "/leave", 
  validateRequest(joinAndLeaveEventSchema),
  validateLeaveEvent, async(req, res, next) => {
    try {
      const leaveTheEvent = await eventsController.leaveEvent(req.body);
      res.send(leaveTheEvent);
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
  validateIsEventOwner,
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
eventRouter.delete("/:id", validateIsEventOwner, async (req, res, next) => {
  const eventId = parseInt(req.params.id);

  try {
    const eventDeleted = await eventsController.delete(eventId);

    res.send(eventDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = eventRouter;
