// seeders/20260513130100-doctors.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('doctors', [
      {
        user_id: 3,
        specialization: 'Dentist',
        education: 'BDS, MDS',
        experience_years: 5,
        consultation_fee: 500,
        bio: "Dedicated and compassionate Dentist focused on providing quality dental care with a patient-centered approach. Skilled in preventive, restorative, and cosmetic dentistry with a commitment to improving oral health and confident smiles",
        is_first_login: false,
        password_changed_at: new Date(),
      
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 4,
        specialization: 'Cardiologist',
        education: 'MBBS, MD Cardiology',
        experience_years: 8,
        consultation_fee: 900,
        bio: "Experienced Cardiologist dedicated to diagnosing and treating heart-related conditions with advanced cardiac care and patient-focused treatment.",
        is_first_login: false,
        password_changed_at: new Date(),
      
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 5,
        specialization: 'Neurologist',
        education: 'MBBS, DM Neurology',
        experience_years: 10,
        consultation_fee: 1200,
        bio: "Dedicated Neurologist specializing in the diagnosis and treatment of brain, spine, and nervous system disorders with compassionate patient care.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 6,
        specialization: 'Dermatologist',
        education: 'MBBS, MD Dermatology',
        experience_years: 6,
        consultation_fee: 700,
        bio: "Skilled Dermatologist focused on treating skin, hair, and nail conditions with modern dermatological care and personalized treatment plans.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 7,
        specialization: 'Orthopedic',
        education: 'MBBS, MS Orthopedics',
        experience_years: 7,
        consultation_fee: 850,
        bio: "Experienced Orthopedic specialist focused on diagnosing and treating bone, joint, and musculoskeletal conditions with advanced orthopedic care.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 8,
        specialization: 'Pediatrician',
        education: 'MBBS, MD Pediatrics',
        experience_years: 4,
        consultation_fee: 600,
        bio: "Compassionate Pediatrician dedicated to providing comprehensive healthcare for infants, children, and adolescents with a child-friendly approach.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 9,
        specialization: 'ENT',
        education: 'MBBS, MS ENT',
        experience_years: 9,
        consultation_fee: 750,
        bio: "Experienced ENT specialist dedicated to diagnosing and treating ear, nose, and throat disorders with advanced and patient-focused care.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 10,
        specialization: 'Gynecologist',
        education: 'MBBS, MD Gynecology',
        experience_years: 11,
        consultation_fee: 1000,
        bio:  "Experienced Gynecologist dedicated to providing comprehensive women’s healthcare with expertise in pregnancy, reproductive health, and wellness.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 11,
        specialization: 'General Physician',
        education: 'MBBS',
        experience_years: 3,
        consultation_fee: 400,
        bio: "Experienced General Physician focused on diagnosing and treating a wide range of medical conditions with compassionate and preventive healthcare.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 12,
        specialization: 'Psychiatrist',
        education: 'MBBS, MD Psychiatry',
        experience_years: 12,
        consultation_fee: 1300,
        bio:  "Compassionate Psychiatrist focused on diagnosing and treating mental health conditions with personalized care and evidence-based therapy.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 13,
        specialization: 'Urologist',
        education: 'MBBS, MCh Urology',
        experience_years: 6,
        consultation_fee: 950,
        bio: "Experienced Urologist specializing in the diagnosis and treatment of urinary tract and male reproductive system disorders with advanced patient care.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 14,
        specialization: 'Ophthalmologist',
        education: 'MBBS, MS Ophthalmology',
        experience_years: 5,
        consultation_fee: 800,
        bio: "Experienced Ophthalmologist dedicated to diagnosing and treating eye disorders with advanced vision care and patient-focused treatment.",
        is_first_login: false,
        password_changed_at: new Date(),
        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 15,
        specialization: 'Pulmonologist',
        education: 'MBBS, DM Pulmonology',
        experience_years: 9,
        consultation_fee: 1100,
        bio: "Experienced Pulmonologist specializing in the diagnosis and treatment of respiratory and lung disorders with advanced pulmonary care.",
        is_first_login: false,
        password_changed_at: new Date(),        
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 16,
        specialization: 'Oncologist',
        education: 'MBBS, DM Oncology',
        experience_years: 14,
        consultation_fee: 1500,
        bio: "Experienced Oncologist specializing in the diagnosis and treatment of cancer with compassionate care and advanced oncology treatments."
,
        is_first_login: false,
        password_changed_at: new Date(),      
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 17,
        specialization: 'Nephrologist',
        education: 'MBBS, DM Nephrology',
        experience_years: 8,
        consultation_fee: 1000,
        bio: "Experienced Nephrologist specializing in the diagnosis and treatment of kidney-related disorders with advanced renal care and patient-focused treatment.",
        is_first_login: false,
        password_changed_at: new Date(),     
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctors', null, {});
  },
};