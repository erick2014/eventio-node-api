const { validateRequest } = require("./validateData.js")
const { getAllEventsByUserSchema, getAllEventsSchema, headersSchema } = require("../routes/schemas/events.js")

function selectValidationSchema(req, res, next) {
  const userId =  req.idDecoded
  req.query.pageNumber = Number(req.query.pageNumber)
  req.query.itemsPerPage = Number(req.query.itemsPerPage)

  if (userId) {
    validateRequest(getAllEventsByUserSchema, "query")(req, res, next);
  } else {
    validateRequest(getAllEventsSchema, "query")(req, res, next);
  }
}

module.exports = { selectValidationSchema }