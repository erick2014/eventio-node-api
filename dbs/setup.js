import { Sequelize } from "sequelize";
import config from "./config/index.js";
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
    console.log("initializing a new connection instance");
    sequelize = new Sequelize(config[ENVIRONMENT]);
    return sequelize;
  } catch (error) {
    console.log("error connecting to the db..");
    throw error;
  }
};

export { getInstance };
