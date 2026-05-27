'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('specializations', [
      {
        name: 'Cardiologist',
        description: 'Specialists in diagnosing and treating heart and cardiovascular diseases.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dermatologist',
        description: 'Experts in skin, hair, nail disorders and cosmetic skin treatments.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Neurologist',
        description: 'Doctors specialized in brain, spinal cord and nervous system disorders.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pediatrician',
        description: 'Medical professionals providing healthcare for infants, children and adolescents.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gynecologist',
        description: 'Specialists in women’s reproductive health and pregnancy care.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Orthopedic',
        description: 'Experts in bones, joints, muscles, ligaments and musculoskeletal treatments.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'General Physician',
        description: 'Primary healthcare doctors treating common illnesses and general health issues.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ENT',
        description: 'Specialists treating ear, nose, throat, sinus and related disorders.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ophthalmologist',
        description: 'Eye specialists providing vision care, eye surgeries and disease treatments.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dentist',
        description: 'Doctors specialized in oral health, teeth, gums and dental procedures.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Urologist',
        description: 'Specialists treating urinary tract disorders and male reproductive system issues.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Psychiatrist',
        description: 'Mental health specialists diagnosing and treating emotional and psychological disorders.',
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specializations', null, {});
  },
};