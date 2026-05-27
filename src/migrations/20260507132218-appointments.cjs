'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: "doctors",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      patient_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: "patients",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      appointment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },

      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "pending",
          "confirmed",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint("appointments", {
      fields: ["doctor_id", "appointment_date", "start_time"],
      type: "unique",
      name: "unique_doctor_appointment_slot",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('appointments');

  }
};






