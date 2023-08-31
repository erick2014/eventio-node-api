const { EventsAttendees } = require("../models/associations.js");

async function validateJoinEvent(req, res, next) {
  try {
    const { userId, eventId } = req.body;
  
    let result = await EventsAttendees.findOne({ where : {event_id: eventId, user_id: userId}})
    
    if (result) {
      const error = new Error("You are already join to this event");
      error.statusCode = 400;
      throw error
    }
    
    next()
  } catch (error) {
    next(error);
  }
} 


module.exports = { validateJoinEvent }