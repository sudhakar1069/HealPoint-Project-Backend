import { Sequelize } from "sequelize";
console.log("DATABASE_URL =", process.env.DATABASE_URL);

export const sequelize = new Sequelize(
  process.env.DATABASE_URL!,
  {
    dialect: "mysql",
    logging: false,
  }
);