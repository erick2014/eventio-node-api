
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

  it("GET / Should return 200 and all events in the database", async () => {
    const response = await request(app).get("/events/");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.be.greaterThan(0);

    const firstEvent = response.body[0];
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

  it("DELETE / Should return 200 and delete an event", async () => {
    const eventId = createdEvent.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .send({ userId: createdEvent.owner_id });
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  });

  it("DELETE /events/ Should return 404 and an error if user isn`t owner event`s ", async () => {
    const eventId = createdEvent.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .send({ userId: 10 });

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({
      error: "Event not found",
    });
  }); 

  it("DELETE /events/ Should return 404 and an error if event does not exist", async () => {
    const eventId = 10;
    const response = await request(app)
      .delete(`/events/${eventId}`)
      .send({ userId: createdEvent.owner_id });
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
    const dataToReques = { userId : user2.id, eventId }
    const response = await request(app).post("/events/join").send(dataToReques)
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  })

  it("POST /events/join Should return 404 and error if the user already joined the event", async () => {
    const eventId = createdEvent.id;
    const userId = createdEvent.owner_id
    const dataToReques = { userId, eventId }

    const response = await request(app).post("/events/join").send(dataToReques)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({error: "You are already join to this event"});
  })

  it("POST /events/join Should return 400 and error if body.eventId param is empty", async () => {
    const userId = createdEvent.owner_id
    const dataToReques = { userId }

    const response = await request(app).post("/events/join").send(dataToReques)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Event Id"));
  })

  it("POST /events/join Should return 400 and error if body.userId param is empty", async () => {
    const eventId = createdEvent.id;
    const dataToReques = { eventId }

    const response = await request(app).post("/events/join").send(dataToReques)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("User Id"));
  })

 it("DELETE /events/leave Should return 200 and success: true if an user leaved of an event", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma2@gmail.com",
      password: "dilan123",
    });

    const eventId = createdEvent.id;
    const userId = user2.id
    const resultado = await eventsController.joinEvent(eventId, userId, false)
    console.log("resultado", resultado)

    const dataToReques = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToReques)
    console.log("response.body", response.body)
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  }) 

  it("DELETE /events/leave Should return 404 and error if body.eventId param is empty", async () => {
    const userId = createdEvent.owner_id;
    const dataToReques = { userId }
    const response = await request(app).delete("/events/leave").send(dataToReques)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Event Id"));
  })

  it("DELETE /events/leave Should return 404 and error if body.userId param is empty", async () => {
    const eventId = createdEvent.id;
    const dataToReques = { eventId }
    const response = await request(app).delete("/events/leave").send(dataToReques)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("User Id"));
  })

it("DELETE /events/leave Should return 404 and error if the user aren't join to event", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma3@gmail.com",
      password: "dilan123",
    });

    const userId = user2.id
    const eventId = createdEvent.id;
    const dataToReques = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToReques)
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({error: "You aren't join to event"});
  }) 

  it("DELETE /events/leave Should return 404 and error if the user is event owner", async () => {
    const userId = createdEvent.owner_id
    const eventId = createdEvent.id;
    const dataToReques = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToReques)
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({error: "You are the owner of this event"});
  })
});
