const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const { mockedErrorParamsEmpty } = require("../mocks/login.mock.js");
const userController = new UsersController();

describe("login tests", () => {
  before(async function () {
    await userController.createUser({
      firstName: "Charlotte",
      lastName: "Perez",
      email: "char@gmail.com",
      password: "dilan1",
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await userController.deleteAllUsers();
  });

  it("POST /auth/login Should return 200, find an user and create an accessToken", async () => {
    const userParams = {
      email: "char@gmail.com",
      password: "dilan1",
    };

    const response = await request(app)
    .post("/auth/login")
    .send(userParams);

    const user = response.body.userFound
    expect(response.status).to.equal(200);
    expect(user).to.have.property("email", userParams.email);
    expect(user).to.have.property("firstName");
    expect(user).to.have.property("lastName");
    expect(response.body).to.have.property("accessToken");
  });

  it("POST /auth/login Should return 401 and error if insert an email or password invalid ", async () => {
    const userParams = {
      email: "char@gmail.com",
      password: "dilan123",
    };

    const response = await request(app)
    .post("/auth/login")
    .send(userParams);

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      error: "Invalid email or password",
    });
  });

  it("POST /auth/login Should return an error if body.email is empty ", async () => {
    const userParams = {
      password: "dilan1",
    };

    const response = await request(app)
    .post("/auth/login")
    .send(userParams);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Email"));
  });

  it("POST /auth/login Should return an error if body.password is empty ", async () => {
    const userParams = {
      email: "char@gmail.com",
    };

    const response = await request(app)
    .post("/auth/login")
    .send(userParams);
    
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorParamsEmpty("Password"));
  });
});
