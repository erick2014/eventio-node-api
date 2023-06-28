const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const EventsController = require("../../src/controllers/eventController.js");
const {
  mockedGetAllEvents,
  mockedCreateEvent,
  mockedErrorParamsEmptyCreateEvent,
  mockedErrorParamsEmpty,
} = require("../mocks/event.mock.js");

describe("Event test", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should return 200 and all events in the database", async () => {
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "getAllEvents"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedGetAllEvents);
    });

    const response = await request(app).get("/events/");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockedGetAllEvents);
  });

  it("Should return 200 and create an event ", async () => {
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedCreateEvent);
    });

    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockedCreateEvent);
  });

  it("Should return an error if body is empty ", async () => {
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmptyCreateEvent);
    });

    const response = await request(app).post("/events/").send();
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmptyCreateEvent);
  });

  it("Should return an error if body.title is empty", async () => {
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Title"));
    });

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
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Description"));
    });

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
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Date"));
    });

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
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Time"));
    });

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
    const mockEventsController = sinon.stub(
      EventsController.prototype,
      "create"
    );

    mockEventsController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Capacity"));
    });

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
});
