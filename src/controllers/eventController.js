const { Users, EventsAttendees, Events } = require("../models/associations.js");
const { fn, col, where } = require("sequelize");
class EventsController {

  buildEventData(eventDetail){
    eventDetail = eventDetail.get({ plain: true });
    const eventData = eventDetail.event;
    const dataOwnerEvent = eventDetail.user;
    const hostEvent = `${dataOwnerEvent.firstName} ${dataOwnerEvent.lastName}`;
    const attendeesIdUser = eventDetail.attendeesId.split(",");
    let attendeesNames

    if(eventDetail.attendees){
      attendeesNames = eventDetail.attendees.split(",");
    }

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
      ...(attendeesNames && {attendeesNames}),
    };

    return event
  }

  async getUserEvents(userId) {
    const eventsUser = await EventsAttendees.findAll({
      group: "event_id", // Group by event_id from the EventsAttendees table
      having: where(fn("FIND_IN_SET", userId, col("attendeesId")), ">", 0),
      attributes: [
        [fn("GROUP_CONCAT", col("events_attendees.user_id")), "attendeesId"],
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
      return this.buildEventData(element)
    });

    return eventsList;
  }

  async getAllEvents() {
    const allEvents = await EventsAttendees.findAll({
      group: "event_id",
      attributes: [[fn("GROUP_CONCAT", col("user_id")), "attendeesId"]],
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
      return this.buildEventData(element)
       
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

    const eventDetail = findEvent[0];
    const eventData = this.buildEventData(eventDetail)

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

    await this.joinEvent(event.id, userId, true);

    return event;
  }

  async update(eventData, eventId) {
    const { userId, ...userParams } =eventData;
    const dataToUpdate = {
      ...userParams,
    };
    await Events.update(dataToUpdate, {
      where: { id: eventId },
    });
    return { id: eventId, ...dataToUpdate };
  }

  async delete(eventId) {
    Events.destroy({ where: { id: eventId } });
    return { success: true };
  }

  async deleteAllEvents() {
    await Events.destroy({ where: {} });
    await EventsAttendees.destroy({ where: {} });
  }

  joinEvent(eventId, userId, isOwner) {
    const newAssociation = EventsAttendees.create({
      isOwner,
      event_id: eventId,
      user_id: userId,
    });

    return newAssociation;
  }

  async leaveEvent(data) {
    const { userId, eventId } = data;
    
    EventsAttendees.destroy({ where : {event_id: eventId, user_id: userId}})
    return { success: true }; 
  }
}

module.exports = EventsController;
