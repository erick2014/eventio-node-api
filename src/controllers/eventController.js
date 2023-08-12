const { array } = require("joi");
const { Users, EventsAttendees, Events } = require("../models/associations.js");
const { fn, col, where } = require("sequelize");
class EventsController {
  async getUserEvents(userId) {
    const eventsUser = await EventsAttendees.findAll({
      group: "event_id", // Group by event_id from the EventsAttendees table
      having: where(fn("FIND_IN_SET", userId, col("attendees")), ">", 0),
      attributes: [
        [fn("GROUP_CONCAT", col("events_attendees.user_id")), "attendees"],
      ],
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

    let eventsList = eventsUser.map((element) => {
      let eventElement = element.get({ plain: true });
      let ownerEventData = eventElement.user;
      let ownerEvent = `${ownerEventData.firstName} ${ownerEventData.lastName}`;
      let idAttendees = eventElement.attendees.split(",");

      return {
        id: eventElement.event.id,
        nameEvent: eventElement.event.title,
        descriptionEvent: eventElement.event.description,
        date: eventElement.event.event_date,
        time: eventElement.event.event_time,
        capacity: eventElement.event.capacity,
        eventOwner: eventElement.event.owner_id,
        host: ownerEvent,
        attendees: idAttendees,
      };
    });

    return eventsList;
  }

  async getAllEvents() {
    const allEvents = await EventsAttendees.findAll({
      group: "event_id",
      attributes: [[fn("GROUP_CONCAT", col("user_id")), "attendees"]],
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

    let eventsList = allEvents.map((element) => {
      let eventElement = element.get({ plain: true });
      let ownerEventData = eventElement.user;
      let ownerEvent = `${ownerEventData.firstName} ${ownerEventData.lastName}`;
      let idAttendees = eventElement.attendees.split(",");

      return {
        id: eventElement.event.id,
        nameEvent: eventElement.event.title,
        descriptionEvent: eventElement.event.description,
        date: eventElement.event.event_date,
        time: eventElement.event.event_time,
        capacity: eventElement.event.capacity,
        eventOwner: eventElement.event.owner_id,
        host: ownerEvent,
        attendees: idAttendees,
      };
    });

    return eventsList;
  }

  async getEvent(eventId) {
    const findEvent = await EventsAttendees.findAll({
      attributes: [
        [fn("GROUP_CONCAT", col("firstName")), "attendees"],
        [fn("GROUP_CONCAT", col("user_id")), "attendeesId"],
      ],
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
      where: { event_id: eventId },
      group: ["event_id"],
    });

    if (!findEvent.length) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    let eventDetail = findEvent[0];
    eventDetail = eventDetail.get({ plain: true });
    const eventData = eventDetail.event;
    const dataOwnerEvent = eventDetail.user;
    const hostEvent = `${dataOwnerEvent.firstName} ${dataOwnerEvent.lastName}`;
    const attendeesIdUser = eventDetail.attendeesId.split(",");
    const attendeesNames = eventDetail.attendees.split(",");

    const event = {
      id: eventData.id,
      nameEvent: eventData.title,
      descriptionEvent: eventData.description,
      date: eventData.event_date,
      time: eventData.event_time,
      capacity: eventData.capacity,
      eventOwner: eventData.owner_id,
      host: hostEvent,
      attendees: attendeesIdUser,
      nameAttendees: attendeesNames,
    };

    return event;
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
      owner_id: userId,
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
    await EventsAttendees.destroy({ where: {} });
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
