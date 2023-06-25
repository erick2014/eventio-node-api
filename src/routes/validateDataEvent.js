const Joi = require("joi");

const createEventSchema = Joi.object({
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  event_date: Joi.string().required().label("Date"),
  event_time: Joi.string().required().label("Time"),
  capacity_people_event: Joi.string().required().label("Capacity"),
});

function validateRequestEvent(joiSchema, method = "body") {
  return function (req, res, next) {
    let requestDataEvent = null;

    if (method === "body") {
      requestDataEvent = req.body;
    } else if (method === "query") {
      requestDataEvent = req.query;
    } else if (method === "params") {
      requestDataEvent = req.params;
    }

    const { error } = joiSchema.validate(requestDataEvent, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      res.status(400).json({
        error: errorMessage,
      });
      return;
    }
    next();
  };
}

module.exports = { createEventSchema, validateRequestEvent };
