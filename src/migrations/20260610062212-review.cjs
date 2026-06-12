"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        appointment_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "appointments",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        doctor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "doctors",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        patient_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "patients",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        review: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },

        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
    });

    await queryInterface.addIndex("reviews", ["doctor_id"]);
    await queryInterface.addIndex("reviews", ["patient_id"]);
},
  async down(queryInterface) {
    await queryInterface.dropTable("reviews");
  },
};
