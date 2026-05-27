// seeders/20260519120000-patients.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('patients', [
      {
        user_id: 18,
        dob: '1998-05-12',
        age: 27,
        blood_group: 'A+',
        address: 'Chennai, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 19,
        dob: '1995-09-20',
        age: 30,
        blood_group: 'B+',
        address: 'Coimbatore, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 20,
        dob: '2001-01-15',
        age: 24,
        blood_group: 'O+',
        address: 'Madurai, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 21,
        dob: '1992-07-08',
        age: 33,
        blood_group: 'AB+',
        address: 'Salem, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 22,
        dob: '1988-11-30',
        age: 37,
        blood_group: 'A-',
        address: 'Trichy, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 23,
        dob: '1999-03-25',
        age: 26,
        blood_group: 'B-',
        address: 'Erode, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 24,
        dob: '1990-12-14',
        age: 35,
        blood_group: 'O-',
        address: 'Tirunelveli, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 25,
        dob: '2003-06-18',
        age: 22,
        blood_group: 'AB-',
        address: 'Vellore, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 26,
        dob: '1997-08-10',
        age: 28,
        blood_group: 'A+',
        address: 'Thoothukudi, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 27,
        dob: '1994-02-05',
        age: 31,
        blood_group: 'O+',
        address: 'Kanyakumari, Tamil Nadu',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patients', null, {});
  },
};