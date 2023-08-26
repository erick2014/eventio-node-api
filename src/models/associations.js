const { Users } = require("./usersModel.js");
const EventsAttendees = require("./events_attendeesModel.js");
const Events = require("./eventsModel.js");

EventsAttendees.belongsTo(Events, {
  foreignKey: "event_id",
});
EventsAttendees.belongsTo(Users, { foreignKey: "user_id" });

Events.hasMany(EventsAttendees, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
  hooks: true
});
Users.hasMany(EventsAttendees, { 
  foreignKey: "user_id", 
  onDelete: "CASCADE", 
  hooks: true  
});

module.exports = {
  EventsAttendees,
  Users,
  Events,
};
