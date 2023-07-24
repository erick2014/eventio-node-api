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
  capacity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const Events = sequelize.define("events", schemaEvents, {
  tableName: "events",
  freezeTableName: true,
});

module.exports = Events;
