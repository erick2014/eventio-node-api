const { DataTypes } = require("sequelize");
const { getInstance } = require("../../dbs/setup.js");
const sequelize = getInstance();

const schemaUsers = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Users = sequelize.define("users", schemaUsers, {
  tableName: "users",
  createdAt: false,
  updatedAt: false,
  freezeTableName: true,
});

module.exports = { Users, schemaUsers };
