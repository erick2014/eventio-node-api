const app = require("../../app.js");
const request = require("supertest");
const expect = require("chai").expect;
const EventsController = require("../../src/controllers/eventController.js");
const eventsController = new EventsController();
const UsersController = require("../../src/controllers/usersController.js");
const usersController = new UsersController();
const {
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

 it("DELETE /events/leave Should return 200 and success: true if an user leaved of an event", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma2@gmail.com",
      password: "dilan123",
    });

    const eventId = createdEvent.id;
    const userId = user2.id
    await eventsController.joinEvent(eventId, userId, false)

    const dataToReques = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToReques)
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