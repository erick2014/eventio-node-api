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
  mockedErrorCreateUser,
  mockedErrorParamsEmpty,
};
