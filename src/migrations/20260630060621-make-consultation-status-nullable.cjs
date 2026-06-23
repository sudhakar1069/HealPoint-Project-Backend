'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appointments', 'consultation_status', {
      type: Sequelize.ENUM(
        'scheduled',
        'ongoing',
        'completed',
        'missed'
      ),
      allowNull: true,
      defaultValue: null
    });

    // Clean existing cancelled appointments
    await queryInterface.sequelize.query(`
      UPDATE appointments
      SET consultation_status = NULL
      WHERE status = 'cancelled';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Restore cancelled appointments to the previous default
    await queryInterface.sequelize.query(`
      UPDATE appointments
      SET consultation_status = 'scheduled'
      WHERE consultation_status IS NULL;
    `);

    await queryInterface.changeColumn('appointments', 'consultation_status', {
      type: Sequelize.ENUM(
        'scheduled',
        'ongoing',
        'completed',
        'missed'
      ),
      allowNull: false,
      defaultValue: 'scheduled'
    });
  }
};