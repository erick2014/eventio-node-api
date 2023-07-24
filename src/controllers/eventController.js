const { Users, EventsAttendees, Events } = require("../models/associations.js");
const { literal } = require("sequelize");
class EventsController {
  async findEvent(eventId) {
    const event = await Events.findOne({
      where: { id: eventId },
    });

    return event;
  }

  async getUserEvents(userId) {
    const eventsUser = await Events.findAll(
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
            include: [
              {
                model: Users,
                attributes: ["firstName", "lastName"],
              },
            ],
          },
        ],
      },
      { raw: true }
    );

    /*     const arrayEventUser = eventsUser.map((event) => {
      const {
        id,
        title,
        description,
        event_date,
        event_time,
        capacity,
        userCount,
        events_attendees,
      } = event;

      const idOwnerEvent = events_attendees.dataValues.user_id;
      const nameOwnerEvent = events_attendees.dataValues.user.firstName;
      const lastNameOwnerEvent = events_attendees.dataValues.user.lastName;
      const hostEvent = `${nameOwnerEvent} ${lastNameOwnerEvent}`;

      console.log("attendees", events_attendees);
      return {
        id,
        nameEvent: title,
        descriptionEvent: description,
        date: event_date,
        time: event_time,
        capacity: capacity,
        cantAttendees: userCount,
        eventOwner: idOwnerEvent,
        host: hostEvent,
        namesAttendees: namesAttendees,
      };
    }); */

    /*  console.log(eventsUser); */
    return eventsUser;
  }

  getAllEvents() {
    const allEvents = EventsAttendees.findAll({
      attributes: [],
      include: [
        {
          model: Events,
          attributes: [
            "id",
            "title",
            "description",
            "event_date",
            "event_time",
            "capacity",
            "owner_id",
          ],
        },
        {
          model: Users,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    /*     allEvents.map((element) => {
      const attendee = element.get({ plain: true });

      console.log("elemento", attendee);
    }); */
    console.log("allEvents", allEvents);

    return allEvents;
  }

  async getEvent(eventId) {
    const findEvent = await EventsAttendees.findAll({
      attributes: ["event_id", "user_id", "isOwner"],
      include: [
        {
          model: Users,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Events,
          attributes: [
            "id",
            "title",
            "description",
            "event_date",
            "event_time",
            "capacity",
            "owner_id",
          ],
        },
      ],
      where: { event_id: eventId },
    });

    if (!findEvent) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    const eventDetail = findEvent[0].event;

    const attendees = [];
    let eventOwner = null;
    findEvent.forEach((element) => {
      const attendee = element.get({ plain: true });

      if (attendee.isOwner) {
        eventOwner = attendee.user;
      } else {
        attendees.push(attendee.user);
      }
    });

    const hostEvent = `${eventOwner.firstName} ${eventOwner.lastName}`;

    const eventData = {
      id: eventDetail.id,
      nameEvent: eventDetail.title,
      descriptionEvent: eventDetail.description,
      date: eventDetail.event_date,
      time: eventDetail.event_time,
      capacity: eventDetail.capacity,
      eventOwner: eventOwner.id,
      host: hostEvent,
      attendees: attendees,
    };

    return eventData;
  }

  async create(eventData) {
    const { title, description, event_date, event_time, capacity, userId } =
      eventData;
    const event = await Events.create({
      title,
      description,
      event_date,
      event_time,
      capacity,
      owner_id: userId,
    });

    await this.createRecordInEventsAttendees(event.id, userId, true);

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

  createRecordInEventsAttendees(eventId, userId, isOwner) {
    const newAssociation = EventsAttendees.create({
      isOwner,
      event_id: eventId,
      user_id: userId,
    });

    return newAssociation;
  }
}

module.exports = EventsController;
