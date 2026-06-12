import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export interface ReviewAttributes {
    id?: number;
    appointment_id: number;
    doctor_id: number;
    patient_id: number;
    rating: number;
    review?: string;
}

export interface ReviewCreationAttributes
    extends Optional<ReviewAttributes, "id" | "review"> { }

class Review extends Model<
    ReviewAttributes,
    ReviewCreationAttributes
> implements ReviewAttributes {

    declare id: number;
    declare appointment_id: number;
    declare doctor_id: number;
    declare patient_id: number;
    declare rating: number;
    declare review?: string;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        appointment_id: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "doctors",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        patient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "patients",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5, },
        },

        review: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "reviews",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                fields: ["doctor_id"],
            },
            {
                fields: ["patient_id"],
            },
        ],
    }
);

export default Review;