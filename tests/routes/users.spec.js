const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const {
  mockedCreateUser,
  mockedErrorCreateUser,
} = require("../mocks/users.mock.js");

describe("User routes", () => {
  afterEach(() => {
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

  it("POST /signup validate parameters ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorCreateUser);
    });

    const response = await request(app).post("/auth/signup").send();
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorCreateUser);
  });

  // Agrega más casos de prueba para otros endpoints
});
