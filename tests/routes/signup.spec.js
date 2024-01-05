const app = require("../../app.js");
const request = require("supertest");
const sinon = require("sinon");
const expect = require("chai").expect;
const UsersController = require("../../src/controllers/usersController.js");
const {
  mockedErrorCreateUser,
  mockedErrorParamsEmpty,
} = require("../mocks/signup.mock.js");
const userController = new UsersController();

describe("signup tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await userController.deleteAllUsers();
  });

  it("POST /auth/signup Should return 200, create an user and create an accessToken ", async () => {
    const newUserParams = {
      firstName: "Charlotte",
      lastName: "Perez",
      email: "charlotte@gmail.com",
      password: "dilan1",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    const userData  = response.body.newUser
    expect(userData).to.have.property("id").and.not.be.null;
    expect(userData).to.have.property(
      "firstName",
      newUserParams.firstName
    );
    expect(userData).to.have.property("lastName", newUserParams.lastName);
    expect(userData).to.have.property("email", newUserParams.email);
    expect(response.body).to.have.property("accessToken").and.not.be.null
  });

  it("POST /auth/signup Should return an error if body is empty ", async () => {
    const response = await request(app).post("/auth/signup").send();
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal(mockedErrorCreateUser);
  });

  it("POST /auth/signup Should return an error if body.firstName is empty ", async () => {
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

  it("POST /auth/signup Should return an error if body.lastName is empty ", async () => {
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

  it("POST /auth/signup Should return an error if body.email is empty ", async () => {
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

  it("POST /auth/signup Should return an error if body.password is empty ", async () => {
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

  it("POST /auth/signup Should return and error if email already exists ", async () => {
    const newUserParams = {
      firstName: "Charlotte",
      lastName: "Perez",
      email: "charlotte@gmail.com",
      password: "dilan1",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(newUserParams);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ error: "This user already exists" });
  });
});
