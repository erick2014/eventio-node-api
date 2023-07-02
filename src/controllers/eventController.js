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

  async update(eventData, eventId) {
    const { title, description, event_date, event_time, capacity } = eventData;

    const dataToUpdate = {
      title,
      description,
      event_date,
      event_time,
      capacity,
    };

    await Events.update(dataToUpdate, {
      where: { id: eventId },
    });

    return { id: eventId, ...dataToUpdate };
  }

  delete(eventId) {
    const eventToDelete = Events.findOne({ where: { id: eventId } });
    Events.destroy({ where: { id: eventId } });

    return eventToDelete;
  }

  async deleteEventsInDBCopy() {
    await Events.destroy({ where: {} });
  }
}

module.exports = EventsController;
