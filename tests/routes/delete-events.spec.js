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

  it("DELETE /events/ Should return 400 and error if user isn't owner's event ", async () => {
    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 10,
      userId: createdEvent.owner_id,
    };
    const event = await eventsController.create(eventData);
    const eventId = event.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .send({ userId: 10 });
    console.log("response.body", response.body)
    expect(response.status).to.equal(400) ;
    expect(response.body).to.deep.equal({
      error: "This user is not the owner of this event",
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
    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 10,
      userId: createdEvent.owner_id,
    };
    const event = await eventsController.create(eventData);
    const eventId = event.id;

    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma2@gmail.com",
      password: "dilan123",
    });
    const userId = user2.id

    await eventsController.joinEvent(eventId, userId, false)

    const dataToRequest = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToRequest)
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  }) 

  it("DELETE /events/leave Should return 404 and error if body.eventId param is empty", async () => {
    const userId = createdEvent.owner_id;
    const dataToRequest = { userId }
    const response = await request(app).delete("/events/leave").send(dataToRequest)
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Event Id"));
  })

  it("DELETE /events/leave Should return 404 and error if body.userId param is empty", async () => {
    const eventId = createdEvent.id;
    const dataToRequest = { eventId }
    const response = await request(app).delete("/events/leave").send(dataToRequest)
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
    const dataToRequest = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToRequest)
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({error: "You aren't join to event"});
  }) 

  it("DELETE /events/leave Should return 404 and error if the user is event owner", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma24@gmail.com",
      password: "dilan123",
    });
    const userId = user2.id

    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 10,
      userId: userId,
    };
    const event = await eventsController.create(eventData);
    const eventId = event.id;

    const dataToRequest = { userId, eventId }
    const response = await request(app).delete("/events/leave").send(dataToRequest)
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({error: "You are the owner of this event"});
  })
});