const { Users, EventsAttendees, Events } = require("../models/associations.js");
const { literal } = require("sequelize");
class EventsController {
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

    return eventsUser;
  }

  async getAllEvents() {
    const allEvents = await EventsAttendees.findAll({
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

    let eventsList = allEvents.reduce((result, element) => {
      let eventElement = element.get({ plain: true });
      const idOwner = eventElement.event.owner_id;
      const userEvent = eventElement.user;

      if (idOwner == userEvent.id) {
        const nameOwner = userEvent.firstName;
        const lastNameOwner = userEvent.lastName;
        eventElement.event.host = `${nameOwner} ${lastNameOwner}`;
        eventElement.event.attendees = [userEvent];
      }

      eventElement.event = {
        id: eventElement.event.id,
        nameEvent: eventElement.event.title,
        descriptionEvent: eventElement.event.description,
        date: eventElement.event.event_date,
        time: eventElement.event.event_time,
        capacity: eventElement.event.capacity,
        eventOwner: eventElement.event.owner_id,
        host: eventElement.event.host,
        attendees: eventElement.event.attendees,
      };

      let existsEvent = result.find(
        (item) => item.event.id === eventElement.event.id
      );

      if (!existsEvent) {
        eventElement.event.attendees = [eventElement.user];
        result.push({
          event: eventElement.event,
        });
      } else {
        existsEvent.event.attendees.push(eventElement.user);
      }
      return result;
    }, []);

    return eventsList;
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

    if (!findEvent.length) {
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
        attendees.push(attendee.user);
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

    console.log("data event", eventData);

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
    const { title, description, event_date, event_time, capacity, userId } =
      eventData;

    const userIsOwner = await this.findUserIsOwnerEvent(userId, eventId);

    if (!userIsOwner) {
      const error = new Error("Sorry but user isn`t owner event`s ");
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

  async delete(eventId, userId) {
    const userIsOwner = await this.findUserIsOwnerEvent(userId, eventId);

    if (!userIsOwner) {
      const error = new Error("Sorry but user isn`t owner event`s ");
      error.statusCode = 404;
      throw error;
    }

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

  async findUserIsOwnerEvent(userId, eventId) {
    let event = await Events.findOne({
      where: { id: eventId },
    });

    if (event == null || !event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }
    event = event.get({ plain: true });

    let userIsOwner = false;

    if (event.owner_id == userId) {
      userIsOwner = true;
    } else {
      userIsOwner = false;
    }

    return userIsOwner;
  }
}

module.exports = EventsController;
