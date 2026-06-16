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
      consultation_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "pending_payment",
          "confirmed",
          "cancelled",
          "completed"
        ),
        allowNull: false,
        defaultValue: "pending_payment",
      },
      payment_expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      meeting_room: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      consultation_status: {
        type: Sequelize.ENUM(
          "scheduled",
          "ongoing",
          "completed",
          "missed"
        ),
        allowNull: false,
        defaultValue: "scheduled",
      },
      consultation_started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      consultation_ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      review_given: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
      reminder_sent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('appointments');
  }
};






