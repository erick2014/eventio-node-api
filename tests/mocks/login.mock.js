const mockedErrorParamsEmpty = (property) => {
  return {
    error: `"${property}" is required`,
  };
};

module.exports = { mockedErrorParamsEmpty };
