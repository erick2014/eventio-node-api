require("./dotenv.js");
require("./src/models/associations.js");
const express = require("express");
const router = require("./src/routes/index.js");
const cors = require('cors');

const PORT = 4000;
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.text());
app.use(express.json());

// setup main router
app.use(router);

// error handler
app.use((err, req, res, next) => {
  if (err.name) {
    console.log(err.name);
  }

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";
  console.log(err?.original ? err.original : err);
  res.status(statusCode).json({ error: errorMessage });
  next();
});

// starts server
app.listen(PORT, () => {
  console.log(`Servidor started at port ${PORT}`);
});

module.exports = app;
