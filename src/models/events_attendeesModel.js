const { DataTypes } = require("sequelize");
const { getInstance } = require("../../dbs/setup.js");
const sequelize = getInstance();

const schemaEventsAttendees = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  isOwner: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const EventsAttendees = sequelize.define(
  "events_attendees",
  schemaEventsAttendees,
  {
    tableName: "events_attendees",
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

module.exports = EventsAttendees;
