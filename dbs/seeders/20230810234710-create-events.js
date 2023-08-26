"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /*const users = await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Zaina",
          lastName: "González",
          email: "zaina@gmail.com",
          password: "dilan123",
        },
        {
          firstName: "Yesenia",
          lastName: "González",
          email: "gyese@gmail.com",
          password: "dilan123",
        },
        {
          firstName: "Dilan",
          lastName: "Toloza",
          email: "d@gmail.com",
          password: "dilan123",
        },
      ],
      {}
    );

    const usersCreated = await Sequelize.findAll(); */
    const usersCreated = await queryInterface.sequelize.query(
      "SELECT * FROM users"
    );

    console.log("users", usersCreated);

    /*  await queryInterface.bulkInsert(
      "events",
      [
        {
          title: "testing",
          description: "Aprender testing",
          event_date: "22/03/2024",
          event_time: "05:00PM",
          capacity: "20",
          createdAt: new Date(),
          updatedAt: new Date(),
          owner_id: 5,
        },
        {
          title: "java",
          description: "Aprender sobre java",
          event_date: "23/01/2024",
          event_time: "05:00PM",
          capacity: "10",
          createdAt: new Date(),
          updatedAt: new Date(),
          owner_id: 6,
        },
        {
          title: "python",
          description: "Aprender sobre python",
          event_date: "23/01/2024",
          event_time: "05:00PM",
          capacity: "10",
          createdAt: new Date(),
          updatedAt: new Date(),
          owner_id: 7,
        },
      ],
      {}
    ); */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
