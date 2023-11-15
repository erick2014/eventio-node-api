const { EventsAttendees, Events } = require("../models/associations.js");

async function validateJoinEvent(req, res, next) {
  try {
    const { eventId } = req.body;
    const userId  = req.idDecoded;

    if(!userId){
      const error = new Error("User Id is required");
      error.statusCode = 403;
      throw error
    }
  
    let result = await EventsAttendees.findOne({ where : {event_id: eventId, user_id: userId}})
    
    if (result) {
      const error = new Error("You are already join to this event");
      error.statusCode = 400;
      throw error
    }

    let event = await Events.findOne({ 
      attributes: [
        "capacity",
      ],
      where : { id: eventId }
    })

    if(!event){
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error
    }

    event = event.get({ plain: true });

    let quantityAttendees = await EventsAttendees.count({ where: { event_id: eventId } })

    if(Number(event.capacity) === quantityAttendees){
      const error = new Error("You cannot join the event, the capacity is full.");
      error.statusCode = 404;
      throw error
    }
    
    next()
  } catch (error) {
    next(error);
  }
} 


module.exports = { validateJoinEvent }