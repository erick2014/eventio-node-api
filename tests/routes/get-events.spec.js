
const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const EventsController = require("../../src/controllers/eventController.js");
const eventsController = new EventsController();
const UsersController = require("../../src/controllers/usersController.js");
const usersController = new UsersController();

describe("Event test", () => {
  let createdEvent;

  before(async () => {
    const user = await usersController.createUser({
      firstName: "Dilan",
      lastName: "Toloza",
      email: "dilan123@gmail.com",
      password: "dilan",
    });

    const eventData = {
      title: "Inglés",
      description: "Learn Inglés",
      event_date: "23/01/1993",
      event_time: "18:00PM",
      capacity: 10,
      userId: user.id,
    };
    createdEvent = await eventsController.create(eventData);
  });

  after(async () => {
    await eventsController.deleteAllEvents();
    await usersController.deleteAllUsers();
  });

  it("GET / Should return 200 and all events in the database", async () => {
    const pageNumber =  0
    const itemsPerPage = 6  
    const response = await request(app).get(`/events/${pageNumber}/${itemsPerPage}`);
    const events = response.body.eventsList
    const lengthEvents = response.body.lengthEvents
    expect(response.status).to.equal(200);
    expect(events).to.be.an("array");
    expect(events.length).to.be.greaterThan(0);
    expect(lengthEvents).to.be.an("number");
    expect(lengthEvents).to.deep.equal(events.length)

    const firstEvent = events[0];
    expect(firstEvent).to.have.property("id").and.not.be.null;
    expect(firstEvent).to.have.property("nameEvent");
    expect(firstEvent).to.have.property("descriptionEvent");
    expect(firstEvent).to.have.property("date");
    expect(firstEvent).to.have.property("time");
    expect(firstEvent).to.have.property("capacity");
    expect(firstEvent).to.have.property("eventOwner");
    expect(firstEvent).to.have.property("host");
    expect(firstEvent).to.have.property("attendees");
  });

  it("GET /event/:eventId Should return 200 and find an event", async () => {
    const eventId = createdEvent.id;
    const response = await request(app).get(`/events/event/${eventId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("id").and.not.be.null;
    expect(response.body).to.have.property("nameEvent");
    expect(response.body).to.have.property("descriptionEvent");
    expect(response.body).to.have.property("date");
    expect(response.body).to.have.property("time");
    expect(response.body).to.have.property("capacity");
    expect(response.body).to.have.property("eventOwner");
    expect(response.body).to.have.property("host");
    expect(response.body).to.have.property("attendees");
    expect(response.body).to.have.property("attendeesNames");
  });

  it("GET /events/:eventId Should return 404 and an error if event does not exist", async () => {
    const eventId = 10;
    const response = await request(app).get(`/events/event/${eventId}`);
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "Event not found" });
  });
});