const Events = require("../models/eventsModel.js");
const Users = require("../models/usersModel.js");
const EventsAttendees = require("../models/events_attendeesModel.js");

class EventsController {
  async findEvent(eventId) {
    const event = await Events.findOne({
      where: { id: eventId },
    });

    return event;
  }

  getUserEvents(userId) {
    const eventsUser = Events.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "event_date",
        "event_time",
        "capacity",
      ],
      include: [
        {
          model: EventsAttendees,
          attributes: [],
          where: { user_id: userId },
        },
      ],
    });

    return eventsUser;
  }

  getAllEvents() {
    const allEvents = Events.findAll({ raw: true });
    console.log("esta entrando aca", allEvents);
    return allEvents;
  }

  async getEvent(eventId) {
    const findEvent = await Events.findOne({
      where: { id: eventId },
      raw: true,
    });

    if (!findEvent) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    return findEvent;
  }

  create(eventData) {
    const { title, description, event_date, event_time, capacity } = eventData;
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

    const existingEvent = await this.findEvent(eventId);

    if (!existingEvent) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

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

  async delete(eventId) {
    const existingEvent = await this.findEvent(eventId);

    if (!existingEvent) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    Events.findOne({ where: { id: eventId } });
    Events.destroy({ where: { id: eventId } });

    return { success: true };
  }

  async deleteAllEvents() {
    await Events.destroy({ where: {} });
  }
}

module.exports = EventsController;
