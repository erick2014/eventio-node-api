import '../../dotenv.js'

export default {
  development: {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.SERVER_HOST,
    "dialect": process.env.DIALECT
  },
  // Add other environments like test and production if needed
};

