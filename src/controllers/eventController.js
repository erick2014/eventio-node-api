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
      id: eventId,
      title,
      description,
      event_date,
      event_time,
      capacity,
    };

    await Events.update(
      {
        title: title || Events.title,
        description: description || Events.description,
        event_date: event_date || Events.event_date,
        event_time: event_time || Events.event_time,
        capacity: capacity || Events.capacity,
      },
      { where: { id: eventId }, returning: true }
    );

    return dataToUpdate;
  }

  delete(eventId) {
    const eventToDelete = Events.findOne({ where: { id: eventId } });
    Events.destroy({ where: { id: eventId } });

    return eventToDelete;
  }
}

module.exports = EventsController;
