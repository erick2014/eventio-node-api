const { Users, EventsAttendees, Events } = require("../models/associations.js");
const { literal } = require("sequelize");
class EventsController {
  async findEvent(eventId) {
    const event = await Events.findOne({
      where: { id: eventId },
    });

    return event;
  }

  getUserEvents(userId) {
    const eventsUser = Events.findAll(
      {
        attributes: [
          "id",
          "title",
          "description",
          "event_date",
          "event_time",
          "capacity",
          [
            literal(
              `(SELECT COUNT(*) FROM events_attendees WHERE event_id = events.id)`
            ),
            "userCount",
          ],
        ],
        include: [
          {
            model: EventsAttendees,
            attributes: ["isOwner", "event_id", "user_id"],
            where: { user_id: userId },
          },
        ],
      },
      { raw: true }
    );
    return eventsUser;
  }

  getAllEvents() {
    const allEvents = Events.findAll(
      {
        attributes: [
          "id",
          "title",
          "description",
          "event_date",
          "event_time",
          "capacity",
          [
            literal(
              `(SELECT COUNT(*) FROM events_attendees WHERE event_id = events.id)`
            ),
            "userCount",
          ],
        ],
        include: [
          {
            model: EventsAttendees,
            attributes: ["isOwner"],
          },
        ],
      },
      { raw: true }
    );
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

  createRecordInEventsAttendees(newEvent, userId) {
    const newAssociation = EventsAttendees.create({
      isOwner: true,
      event_id: newEvent.id,
      user_id: userId,
    });

    return newAssociation;
  }
}

module.exports = EventsController;
