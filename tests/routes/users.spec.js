const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const mockedCreateUser = require("../mocks/users.mock.js");

describe("User routes", () => {
  after(() => {
    sinon.restore();
  });

  it("Test route POST /signup ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedCreateUser);
    });

    const newUserParams = {
      firstName: "Charlotte",
      lastName: "Perez",
      email: "char@gmail.com",
      password: "dilan1",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockedCreateUser);
  });

  // Agrega más casos de prueba para otros endpoints
});

/*  
it("POST /signup", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedCreateUser);
    });

    const response = await request(app).post("/signup");
    console.log("response.body", response.body);
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockedCreateUser);
  }); */

/* 
  const usersController = new UsersController();

  it("POST /signup prueba dos", async () => {
    const mockUsersController = sinon.spy(usersController, "createUser");

    const response = await request(app)
      .post("/signup")
      .send(mockedCreateUser)
      .expect(200);

    console.log(response.body);

    expect(response.body.firstName).to.equal(mockedCreateUser.firstName);
    expect(response.body.lastName).to.equal(usermockedCreateUserData.lastName);
    expect(response.body.email).to.equal(mockedCreateUser.email);

    expect(mockUsersController.calledOnce).to.be.true;
    expect(mockUsersController.firstCall.args[0]).to.deep.equal(
      mockedCreateUser
    );
  }); */
