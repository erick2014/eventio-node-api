const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const {
  mockedCreateUser,
  mockedErrorCreateUser,
  mockedErrorPropertyEmpty,
} = require("../mocks/users.mock.js");

describe("User routes", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should return 200 and create an user ", async () => {
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

  it("Should return an error if body is empty ", async () => {
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

  it("Should return an error if body.firtsName is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorPropertyEmpty("FirstName"));
    });

    const newUserParams = {
      lastName: "Perez",
      email: "char@gmail.com",
      password: "dilan1",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorPropertyEmpty("FirstName"));
  });

  it("Should return an error if body.lastName is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorPropertyEmpty("LastName"));
    });

    const newUserParams = {
      firstName: "Charlotte",
      email: "char@gmail.com",
      password: "dilan1",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorPropertyEmpty("LastName"));
  });

  it("Should return an error if body.email is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorPropertyEmpty("Email"));
    });

    const newUserParams = {
      firstName: "Charlotte",
      lastName: "Perez",
      password: "dilan1",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorPropertyEmpty("Email"));
  });

  it("Should return an error if body.password is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorPropertyEmpty("Password"));
    });

    const newUserParams = {
      firstName: "Charlotte",
      lastName: "Perez",
      email: "char@gmail.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorPropertyEmpty("Password"));
  });
  // Agrega más casos de prueba para otros endpoints
});
