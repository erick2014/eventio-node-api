const mockedFindUser = {
  id: 4,
  firstName: "Charlotte",
  lastName: "Perez",
  email: "char@gmail.com",
  password: "dilan1",
};

const mockedErrorParamsEmpty = (property) => {
  return {
    error: `"${property}" is required`,
  };
};

module.exports = { mockedFindUser, mockedErrorParamsEmpty };
