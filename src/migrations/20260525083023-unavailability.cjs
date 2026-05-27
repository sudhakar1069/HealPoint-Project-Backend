'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('doctor_unavailabilities', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      unavailable_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      is_full_day: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      start_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },

      end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor_unavailabilities');

  }
};