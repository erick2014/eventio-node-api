const mockedGetAllEvents = [
  {
    id: 4,
    title: "Python",
    description: "learnd about Python",
    event_date: "23/12/2024",
    event_time: "06:00PM",
    capacity: "12",
    createdAt: "2023-06-26T20:28:47.000Z",
    updatedAt: "2023-06-28T15:47:29.000Z",
  },
  {
    id: 5,
    title: "JavaaScript",
    description: "learnd about JavaaScript",
    event_date: "23/12/2024",
    event_time: "06:00PM",
    capacity: "12",
    createdAt: "2023-06-28T15:46:39.000Z",
    updatedAt: "2023-06-28T15:46:39.000Z",
  },
];

const mockedCreateEvent = {
  createdAt: "2023-06-26T20:28:47.000Z",
  updatedAt: "2023-06-28T15:47:29.000Z",
  id: 4,
  title: "Python",
  description: "learned about Python",
  event_date: "23/12/2024",
  event_time: "06:00PM",
  capacity: "12",
};

const mockedErrorParamsEmptyCreateEvent = {
  error:
    '"Title" is required, "Description" is required, "Date" is required, "Time" is required, "Capacity" is required',
};

const mockedErrorParamsEmpty = (property) => {
  return {
    error: `"${property}" is required`,
  };
};

const mockedUpdateEvent = {
  id: 4,
  title: "Py",
  description: "learned about Py",
  event_date: "23/12/2024",
  event_time: "06:00PM",
  capacity: "12",
};

const mockedDeleteEvent = {
  success: true,
};

module.exports = {
  mockedGetAllEvents,
  mockedCreateEvent,
  mockedErrorParamsEmptyCreateEvent,
  mockedErrorParamsEmpty,
  mockedUpdateEvent,
  mockedDeleteEvent,
};
