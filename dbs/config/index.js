require("../../dotenv.js");

const { DB_USER, DB_PASS, DB_NAME, SERVER_HOST, DIALECT } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: SERVER_HOST,
    dialect: DIALECT,
  },
  // Add other environments like test and production if needed
};
