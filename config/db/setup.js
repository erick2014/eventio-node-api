import Sequelize from 'sequelize';

// initialize db connection
async function initDb(){
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  try {
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mariadb',
    });
    const dbInstance = await sequelize.authenticate()
    console.log("connected to db")
    return dbInstance
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default initDb