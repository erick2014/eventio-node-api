const { Events } = require("../models/associations.js");

async function findUserIsOwnerEvent(req, res, next) {
  const { userId } = req.body
  const eventId = parseInt(req.params.id);

  let event = await Events.findOne({
    where: { id: eventId },
  });

  if (event === null || !event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    next(error);
    return
  }
  event = event.get({ plain: true });

  if (event.owner_id == userId) {
    next()
  } else {
    const error = new Error("This user is not the owner of this event");
    error.statusCode = 400;
    next(error)
    return 
  }
}

module.exports = { findUserIsOwnerEvent }