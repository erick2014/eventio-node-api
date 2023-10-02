const { Events } = require("../models/associations.js");

async function validateIsEventOwner(req, res, next) {
  try {
    const { userId } = req.body
    const eventId = parseInt(req.params.id);
  
    let event = await Events.findOne({
      where: { id: eventId },
    });
  
    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error
    }
    event = event.get({ plain: true });
  
    if (event.owner_id != userId) {
      const error = new Error("This user is not the owner of this event");
      error.statusCode = 400;
      throw error 
    }
    next()
  } catch (error) {
    next(error);
  }

}

module.exports = { validateIsEventOwner }