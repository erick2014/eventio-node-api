const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const {
  mockedCreateUser,
  mockedErrorCreateUser,
  mockedErrorParamsEmpty,
} = require("../mocks/signup.mock.js");

describe("signup tests", () => {
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
      return Promise.resolve(mockedErrorParamsEmpty("FirstName"));
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
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("FirstName"));
  });

  it("Should return an error if body.lastName is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("LastName"));
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
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("LastName"));
  });

  it("Should return an error if body.email is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Email"));
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
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Email"));
  });

  it("Should return an error if body.password is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "createUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Password"));
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
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Password"));
  });
});
