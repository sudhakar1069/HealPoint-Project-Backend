require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: "Sudhakar@106",
    database: "heal_point",
    host: "localhost",
    dialect: "mysql",
  },

  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
  },
};