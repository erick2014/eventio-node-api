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
  let accessToken;

  before(async () => {
    const newUser = await usersController.createUser({
      firstName: "Dilan",
      lastName: "Toloza",
      email: "dilan123@gmail.com",
      password: "dilan",
    });
    
    const userId  = newUser.user.id
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

  it("DELETE / Should return 200 and delete an event", async () => {
    const eventId = createdEvent.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .set("authorization", accessToken)

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  });

  it("DELETE / Should return 403 and error if token expired", async () => {
    const eventId = createdEvent.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjEsImlhdCI6MTY5OTg4NzU2NywiZXhwIjoxNjk5ODkxMTY3fQ.Zoo2oPgg68ynk9qvqTZGF0OTNbAGENmzkRD-xcvp9uc")

    expect(response.status).to.equal(403);
    expect(response.body).to.deep.equal({
      error: 'jwt expired'
    });
  });

  it("DELETE / Should return 403 and error if token is malform", async () => {
    const eventId = createdEvent.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik")
    console.log("response", response)

    expect(response.status).to.equal(403);
    expect(response.body).to.deep.equal({
      error: "jwt malformed"
    });
  });

  it("DELETE /events/ Should return 400 and error if user isn't owner's event ", async () => {
    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 10,
    };
    const userId = createdEvent.owner_id
    const event = await eventsController.create(eventData, userId);
    const eventId = event.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)

    expect(response.status).to.equal(403) ;
    expect(response.body).to.deep.equal({
      error: "User Id is required",
    });
  }); 

  it("DELETE /events/ Should return 403 and error if authorization is empty ", async () => {
    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 10,
    };
    const userId = createdEvent.owner_id
    const event = await eventsController.create(eventData, userId);
    const eventId = event.id;

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .set("authorization", " ")

    expect(response.status).to.equal(400) ;
    expect(response.body).to.deep.equal({
      error: '"Token Authorization" is not allowed to be empty',
    });
  });

  it("DELETE /events/ Should return 404 and an error if event does not exist", async () => {
    const eventId = 10;
    const response = await request(app)
      .delete(`/events/${eventId}`)
      .set("authorization", accessToken)

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
    };
    const idFirstUser = createdEvent.owner_id
    const event = await eventsController.create(eventData, idFirstUser);
    const eventId = event.id;

    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma2@gmail.com",
      password: "dilan123",
    });
    const idSecondUser = user2.user.id
    const accessToken2 = user2.token

    await eventsController.joinEvent(eventId, idSecondUser, false)

    const response = await request(app)
    .delete("/events/leave")
    .send({ eventId })
    .set("authorization", accessToken2)

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
    });
  }) 

  it("DELETE /events/leave Should return 404 and error if body.eventId param is empty", async () => {
    const response = await request(app)
    .delete("/events/leave")
    .send()
    .set("authorization", accessToken)

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Event Id"));
  })

  it("DELETE /events/leave Should return 404 and error if userId param is empty", async () => {
    const eventId = createdEvent.id;
    const dataToRequest = { eventId }

    const response = await request(app)
    .delete("/events/leave")
    .send(dataToRequest)

    expect(response.status).to.equal(403);
    expect(response.body).to.deep.equal({ error: 'User Id is required' });
  }) 

  it("DELETE /events/leave Should return 404 and error if the user aren't join to event", async () => {
    const user2 = await usersController.createUser({
      firstName: "Emma",
      lastName: "González",
      email: "emma3@gmail.com",
      password: "dilan123",
    });
   
    const userToken = user2.token
    const eventId = createdEvent.id;
    
    const response = await request(app)
    .delete("/events/leave")
    .send({ eventId })
    .set("authorization", userToken)

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
    const userId = user2.user.id
    const userToken = user2.token

    const eventData = {
      title: "Python",
      description: "Learn Python",
      event_date: "25/01/1994",
      event_time: "20:00PM",
      capacity: 10,
    };
    const event = await eventsController.create(eventData, userId);
    const eventId = event.id;

    const response = await request(app)
    .delete("/events/leave")
    .send({ eventId })
    .set("authorization", userToken)

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({error: "You are the owner of this event"});
  })
});