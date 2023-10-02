const mockedErrorParamsEmptyCreateEvent = {
  error:
    '"User Id" is required, "Title" is required, "Description" is required, "Date" is required, "Time" is required, "Capacity" is required',
};

const mockedErrorParamsEmpty = (property) => {
  return {
    error: `"${property}" is required`,
  };
};

module.exports = {
  mockedErrorParamsEmptyCreateEvent,
  mockedErrorParamsEmpty,
};
