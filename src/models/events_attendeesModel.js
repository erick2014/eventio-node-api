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
    references: {
      model: 'events', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const EventsAttendees = sequelize.define(
  "events_attendees",
  schemaEventsAttendees,
  {
    tableName: "events_attendees",
    createdAt: true,
    updatedAt: true,
    freezeTableName: true,
  }
);

module.exports = EventsAttendees;
