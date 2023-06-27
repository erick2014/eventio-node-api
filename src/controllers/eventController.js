const Events = require("../models/eventsModel.js");

class EventsController {
  getAllEvents() {
    const allEvents = Events.findAll({ raw: true });

    return allEvents;
  }

  create({ title, description, event_date, event_time, capacity }) {
    const event = Events.create({
      title,
      description,
      event_date,
      event_time,
      capacity,
    });

    return event;
  }

  async update(
    { title, description, event_date, event_time, capacity },
    eventId
  ) {
    const dataToUpdate = {
      title,
      description,
      event_date,
      event_time,
      capacity,
    };

    await Events.update(dataToUpdate, {
      where: { id: eventId },
      returning: true,
    });

    return { id: eventId, ...dataToUpdate };
  }

  delete(eventId) {
    const eventToDelete = Events.findOne({ where: { id: eventId } });
    Events.destroy({ where: { id: eventId } });

    return eventToDelete;
  }
}

module.exports = EventsController;
