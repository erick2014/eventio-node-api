const mockedCreateUser = {
  id: 4,
  firstName: "Charlotte",
  lastName: "Perez",
  email: "char@gmail.com",
  password: "dilan1",
};

const mockedErrorCreateUser = {
  error:
    '"FirstName" is required, "LastName" is required, "Email" is required, "Password" is required',
};

const mockedErrorParamsEmpty = (property) => {
  return {
    error: `"${property}" is required`,
  };
};

module.exports = {
  mockedCreateUser,
  mockedErrorCreateUser,
  mockedErrorParamsEmpty,
};
