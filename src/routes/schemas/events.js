const Joi = require("joi");

const eventSchema = Joi.object({
  userId: Joi.number().required().label("User Id"),
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  event_date: Joi.string().required().label("Date"),
  event_time: Joi.string().required().label("Time"),
  capacity: Joi.string().required().label("Capacity"),
});

const eventEditSchema = Joi.object({
  userId: Joi.number().required().label("User Id"),
  title: Joi.string().optional().label("Title"),
  description: Joi.string().optional().label("Description"),
  event_date: Joi.string().optional().label("Date"),
  event_time: Joi.string().optional().label("Time"),
  capacity: Joi.string().optional().label("Capacity"),
});

const joinEventSchema = Joi.object({
  userId: Joi.number().required().label("User Id"),
  eventId: Joi.number().required().label("Event Id"),
});

module.exports={
  eventEditSchema,
  eventSchema,
  joinEventSchema
}