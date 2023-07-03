const { Sequelize } = require("sequelize");
const config = require("./config/index.js");
let sequelize = null;

const getInstance = () => {
  try {
    const { ENVIRONMENT } = process.env;

    if (sequelize) {
      console.log("returning instance already found...");
      return sequelize;
    }

    if (!ENVIRONMENT) {
      throw new Error(`Please setup a valid ENVIRONMENT`);
    }

    if (!(ENVIRONMENT in config)) {
      throw new Error(`Environment ${ENVIRONMENT} is not supported`);
    }
    const dbConfig = config[ENVIRONMENT]
    console.log("initializing a new connection instance ",dbConfig);
    sequelize = new Sequelize(dbConfig);
    return sequelize;
  } catch (error) {
    console.log("error connecting to the db..");
    throw error;
  }
};

module.exports = { getInstance };
