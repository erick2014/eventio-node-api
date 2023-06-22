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

const mockedErrorPropertyEmpty = (property) => {
  return {
    error: `"${property}" is required`,
  };
};

module.exports = {
  mockedCreateUser,
  mockedErrorCreateUser,
  mockedErrorPropertyEmpty,
};

/* const mockedFindUser = [
  {
    email: "gyesenia@gmail.com",
    password: "dilanteamo",
  },
]; */
