
const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const EventsController = require("../../src/controllers/eventController.js");
const eventsController = new EventsController();
const UsersController = require("../../src/controllers/usersController.js");
const usersController = new UsersController();

describe("Event test", () => {
  let createdEvent;
  let accessToken;

  before(async () => {
    const newUser = await usersController.createUser({
      firstName: "Dilan",
      lastName: "Toloza",
      email: "dilan123@gmail.com",
      password: "dilan",
    });

    const userId  =  newUser.user.id
    accessToken = newUser.token

    const eventData = {
      title: "Inglés",
      description: "Learn Inglés",
      event_date: "23/01/1993",
      event_time: "18:00PM",
      capacity: 10,
    };
    
    createdEvent = await eventsController.create(eventData, userId);
  });

  after(async () => {
    await eventsController.deleteAllEvents();
    await usersController.deleteAllUsers();
  });

  it("GET /events/pagination Should return 200 and all events in the database", async () => {
    const params  = {
      pageNumber: 0, itemsPerPage: 6 
    }

    const response = await request(app)
    .get("/events/pagination")
    .query(params);

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

  it("GET /events/pagination should return 400 error if the parameters are not correct", async () => {
    const params  = {
      pageNumber: "Emma", itemsPerPage: "Isabella"
    }
    
    const response = await request(app)
    .get("/events/pagination")
    .query(params);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      error: '"Page Number" must be a number, "Item Per Page" must be a number'
    })
  });

  it("GET /events/pagination It should return 400 and error if the parameters entered are not correct", async () => {
    const params  = {
      userId: "Emma", pageNumber: "Emma", itemsPerPage: "Isabella"
    }
    
    const response = await request(app)
    .get("/events/pagination")
    .query(params);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      error: '"Page Number" must be a number, "Item Per Page" must be a number, "userId" is not allowed'
    })
  });

  it("GET /events/pagination Should return 200 and all user events in the database", async () => {
    const params  = {
      pageNumber: 0, 
      itemsPerPage: 6 
    }

    const response = await request(app)
    .get("/events/pagination")
    .query(params)
    .set("authorization", accessToken);

    const events = response.body.eventsList
    const lengthEvents = response.body.lengthEventsUser
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

  it("GET /events/pagination Should return 200 and return one event", async () => {

    const event2 = {
      title: "Blockchain",
      description: "Learn Blockchain",
      event_date: "23/01/1993",
      event_time: "18:00PM",
      capacity: 5,
    };

    const userId = createdEvent.owner_id
    await eventsController.create(event2, userId);

    const params  = {
      pageNumber: 0, itemsPerPage: 1
    }

    const response = await request(app)
    .get("/events/pagination")
    .query(params);

    const events = response.body.eventsList
    const lengthEvents = events.length
    expect(response.status).to.equal(200);
    expect(lengthEvents).to.deep.equal(1)
  });

  it("GET /event/:eventId Should return 200 and find an event", async () => {
    const eventId = createdEvent.id;
    const response = await request(app)
    .get(`/events/event/${eventId}`);
    
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
    const response = await request(app)
    .get(`/events/event/${eventId}`);
    
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "Event not found" });
  });
});