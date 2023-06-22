const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const {
  mockedFindUser,
  mockedErrorParamsEmpty,
} = require("../mocks/login.mock.js");

describe("login tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should return 200 and find an user ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "loginUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedFindUser);
    });

    const userParams = {
      email: "char@gmail.com",
      password: "dilan1",
    };

    const response = await request(app).post("/auth/login").send(userParams);
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockedFindUser);
  });

  it("Should return an error if body.email is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "loginUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Email"));
    });

    const userParams = {
      password: "dilan1",
    };

    const response = await request(app).post("/auth/login").send(userParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Email"));
  });

  it("Should return an error if body.password is empty ", async () => {
    const mockUsersController = sinon.stub(
      UsersController.prototype,
      "loginUser"
    );

    mockUsersController.callsFake(() => {
      return Promise.resolve(mockedErrorParamsEmpty("Password"));
    });

    const userParams = {
      email: "char@gmail.com",
    };

    const response = await request(app).post("/auth/login").send(userParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Password"));
  });
});
