const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const EventsController = require("../../src/controllers/eventController.js");
const eventsController = new EventsController();
const UsersController = require("../../src/controllers/usersController.js");
const usersController = new UsersController();
const {
  mockedErrorParamsEmptyCreateEvent,
  mockedErrorParamsEmpty,
} = require("../mocks/event.mock.js");

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

  it("POST / Should create an event ", async () => {
    createdEvent = createdEvent.get({ plain: true });

    expect(createdEvent).to.have.property("id").and.not.be.null;
    expect(createdEvent).to.have.property("title");
    expect(createdEvent).to.have.property("description");
    expect(createdEvent).to.have.property("event_date");
    expect(createdEvent).to.have.property("event_time");
    expect(createdEvent).to.have.property("capacity");
    expect(createdEvent).to.have.property("owner_id");
  });

  it("POST / Should return an error if body is empty ", async () => {
    const response = await request(app).post("/events/").send();
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmptyCreateEvent);
  });

  it("POST / Should return an error if body.title is empty", async () => {
    const newEvent = {
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
      userId: 1,
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Title"));
  });
  
  it("POST / Should return an error if user not exist", async () => {
    const newEvent = {
      title: "Python",
      description: "Learn Inglés",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
      userId: 15,
    };

    const response = await request(app).post("/events/").send(newEvent);

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "User not found" });
  });

  it("POST / Should return an error if body.description is empty", async () => {
    const newEvent = {
      title: "Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
      userId: 1,
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Description"));
  });

  it("POST / Should return an error if body.event_date is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_time: "06:00PM",
      capacity: "12",
      userId: 1,
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Date"));
  });

  it("POST / Should return an error if body.event_time is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      capacity: "12",
      userId: 1,
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Time"));
  });

  it("POST / Should return an error if body.capacity is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      userId: 1,
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Capacity"));
  });

  it("POST / Should return an error if body.userId is empty", async () => {
    const newEvent = {
      title: "Python",
      description: "learned about Python",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };

    const response = await request(app).post("/events/").send(newEvent);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("User Id"));
  });

  it("PUT Should return 200 and return the event updated", async () => {
    const eventUpdate = {
      userId: createdEvent.owner_id,
      title: "Py",
      description: "learned about Py",
      event_date: "23/12/2024",
      event_time: "06:00PM",
      capacity: "12",
    };
    const eventId = createdEvent.id;

    const response = await request(app)
      .put(`/events/${eventId}`)
      .send(eventUpdate);
    expect(response.status).to.equal(200);
    expect(typeof response.body).to.equal('object');
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
      userId: 1,
    };
    const response = await request(app)
      .put(`/events/${eventId}`)
      .send(eventUpdate);
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ error: "Event not found" });
  });

  it("POST /events/join Should return 200 and success: true if an user joined an event", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma@gmail.com",
      password: "dilan123",
    });

    const eventId = createdEvent.id;
    const dataToRequest = { userId : user2.id, eventId }
    const response = await request(app).post("/events/join").send(dataToRequest)
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  })

  it("POST /events/join Should return 404 and error if capacity is full", async () => {
    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 1,
      userId: createdEvent.owner_id,
    };
    const event = await eventsController.create(eventData);
    const eventId = event.id;

    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emmaIsabella@gmail.com",
      password: "dilan123",
    });

    const dataToRequest = { userId : user2.id, eventId }
    const response = await request(app).post("/events/join").send(dataToRequest)
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({
      error: "You cannot join the event, the capacity is full.",
    });
  })

  it("POST /events/join Should return if event not exist", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emmaIsabella3@gmail.com",
      password: "dilan123",
    });

    const dataToRequest = { userId : user2.id, eventId : 13}
    const response = await request(app).post("/events/join").send(dataToRequest)
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({
      error: "Event not found",
    });
  })

  it("POST /events/join Should return 404 and error if the user already joined the event", async () => {
    const eventId = createdEvent.id;
    const userId = createdEvent.owner_id
    const dataToRequest = { userId, eventId }

    const response = await request(app).post("/events/join").send(dataToRequest)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({error: "You are already join to this event"});
  })

  it("POST /events/join Should return 400 and error if body.eventId param is empty", async () => {
    const userId = createdEvent.owner_id
    const dataToRequest = { userId }

    const response = await request(app).post("/events/join").send(dataToRequest)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Event Id"));
  })

  it("POST /events/join Should return 400 and error if body.userId param is empty", async () => {
    const eventId = createdEvent.id;
    const dataToRequest = { eventId }

    const response = await request(app).post("/events/join").send(dataToRequest)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("User Id"));
  })
});
