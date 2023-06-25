const Events = require("../models/eventsModel.js");

class EventsController {
  createEvent({
    title,
    description,
    event_date,
    event_time,
    capacity_people_event,
  }) {
    const event = Events.create({
      title,
      description,
      event_date,
      event_time,
      capacity_people_event,
    });

    return event;
  }
}

module.exports = EventsController;
