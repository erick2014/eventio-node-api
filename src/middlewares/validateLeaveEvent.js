const { EventsAttendees } = require("../models/associations.js");

async function validateLeaveEvent(req, res, next) {
  try {
    const { userId, eventId } = req.body;
  
    let recordData = await EventsAttendees.findOne({ where : {event_id: eventId, user_id: userId}})
    
    if (recordData === null || !recordData) {
      const error = new Error("You aren't join to event");
      error.statusCode = 404;
      throw error
    }
    
    recordData = recordData.get({ plain: true });
    if (recordData.isOwner) {
      const error = new Error("You are event owner");
      error.statusCode = 404;
      throw error
    }
    next()
  } catch (error) {
    next(error);
  }
} 


module.exports = { validateLeaveEvent }