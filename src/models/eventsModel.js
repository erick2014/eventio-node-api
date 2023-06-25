const { DataTypes } = require("sequelize");
const { getInstance } = require("../../dbs/setup.js");
const sequelize = getInstance();

const schemaEvents = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity_people_event: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Events = sequelize.define("events", schemaEvents, {
  tableName: "events",
  createdAt: Date,
  updatedAt: Date,
  freezeTableName: true,
});

module.exports = Events;
