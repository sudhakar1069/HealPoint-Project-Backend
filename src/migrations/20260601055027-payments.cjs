"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "appointments",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      razorpay_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      razorpay_payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpay_signature: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "created",
          "paid",
          "failed",
          "refunded"
        ),
        defaultValue: "created",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable("payments");
  },
};
