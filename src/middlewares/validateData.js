function validateRequest(joiSchema, method = "body") {
  return function (req, res, next) {
    let requestData = null;

    if (method === "body") {
      requestData = req.body;
    } else if (method === "query") {
      requestData = req.query;
    } else if (method === "params") {
      requestData = req.params;
    } else if (method === "headers"){
      requestData = req.headers;
    }

    const { error } = joiSchema.validate(requestData, {
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

module.exports = {
  validateRequest
};
