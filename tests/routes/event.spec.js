const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const EventsController = require("../../src/controllers/eventController.js");
const eventsController = new EventsController();
const {
  mockedErrorParamsEmptyCreateEvent,
  mockedErrorParamsEmpty,
} = require("../mocks/event.mock.js");

describe("Event test", () => {
  let createdEvent;

  before(async () => {
    const eventData = {
      title: "Inglés",
      description: "Learn Inglés",
      event_date: "23/01/1993",
      event_time: "18:00PM",
      capacity: 10,
    };

    createdEvent = await eventsController.create(eventData);
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await eventsController.deleteAllEvents();
  });

  it("Should return 200 and all events in the database", async () => {
    const response = await request(app).get("/events/");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.be.greaterThan(0);

    const firstEvent = response.body[0];
    expect(firstEvent).to.have.property("id");
    expect(firstEvent).to.have.property("title");
    expect(firstEvent).to.have.property("description");
    expect(firstEvent).to.have.property("event_date");
    expect(firstEvent).to.have.property("event_time");
    expect(firstEvent).to.have.property("capacity");
  });

  it("Should return 200 and create an event ", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("id").and.not.be.null;
    expect(response.body).to.have.property("title");
    expect(response.body).to.have.property("description");
    expect(response.body).to.have.property("event_date");
    expect(response.body).to.have.property("event_time");
    expect(response.body).to.have.property("capacity");
  });

  it("Should return an error if body is empty ", async () => {
    const response = await request(app).post("/events/").send();
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmptyCreateEvent);
  });

  it("Should return an error if body.title is empty", async () => {
    const newEvent = {
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Title"));
  });

  it("Should return an error if body.description is empty", async () => {
    const newEvent = {
      title: "Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Description"));
  });

  it("Should return an error if body.event_date is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Date"));
  });

  it("Should return an error if body.event_time is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Time"));
  });

  it("Should return an error if body.capacity is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Capacity"));
  });

  it("Should return 200 and return the event updated", async () => {
    const eventId = createdEvent.id;
    const eventUpdate = {
      title: "Py",
      description: "learned about Py",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app)
      .put(`/events/${eventId}`)
      .send(eventUpdate);
    expect(response.status).to.equal(200);
    expect(response.body.id).to.deep.equal(eventId);
    expect(response.body.title).to.deep.equal(eventUpdate.title);
    expect(response.body.description).to.deep.equal(eventUpdate.description);
  });

  it("PUT /events/ Should return 404 and an error if event does not exist", async () => {
    const eventId = 10;
    const eventUpdate = {
      title: "Py",
      description: "learned about Py",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };
    const response = await request(app)
      .put(`/events/${eventId}`)
      .send(eventUpdate);
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "Event not found" });
  });

  it("Should return 200 and find an event", async () => {
    const eventId = createdEvent.id;
    const response = await request(app).post(`/events/${eventId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("id");
    expect(response.body).to.have.property("title");
    expect(response.body).to.have.property("description");
    expect(response.body).to.have.property("event_date");
    expect(response.body).to.have.property("event_time");
    expect(response.body).to.have.property("capacity");
  });

  it("POST /events/ Should return 404 and an error if event does not exist", async () => {
    const eventId = 10;
    const response = await request(app).post(`/events/${eventId}`);
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "Event not found" });
  });

  it("Should return 200 and delete an event", async () => {
    const eventId = createdEvent.id;

    const response = await request(app).delete(`/events/${eventId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  });

  it("DELETE /events/ Should return 404 and an error if event does not exist", async () => {
    const eventId = 10;
    const response = await request(app).delete(`/events/${eventId}`);
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "Event not found" });
  });
});
