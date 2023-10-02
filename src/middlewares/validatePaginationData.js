const { validateRequest } = require("./validateData.js")
const { getAllEventsByUserSchema, getAllEventsSchema } = require("../routes/schemas/events.js")

function selectValidationSchema(req, res, next) {
  if(req.query.userId){
    req.query.userId = Number(req.query.userId)
  }
  req.query.pageNumber = Number(req.query.pageNumber)
  req.query.itemsPerPage = Number(req.query.itemsPerPage)


  if (req.query.userId) {
    validateRequest(getAllEventsByUserSchema, "query")(req, res, next);
  } else {
    validateRequest(getAllEventsSchema, "query")(req, res, next);
  }
}

module.exports = { selectValidationSchema }