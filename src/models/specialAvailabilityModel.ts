import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";
export interface SpecialAvailabilityAttributes {
    id?: number;
    doctor_id: number;
    date: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_available?: boolean;
    notes?: string | null;
}

export interface SpecialAvailabilityCreationAttributes
    extends Optional<
        SpecialAvailabilityAttributes,
        "id" | "is_available" | "notes"
    > { }

class SpecialAvailability extends Model<
    SpecialAvailabilityAttributes,
    SpecialAvailabilityCreationAttributes
> implements SpecialAvailabilityAttributes {

    declare id: number;
    declare doctor_id: number;
    declare date: string;
    declare start_time: string;
    declare end_time: string;
    declare slot_duration: number;
    declare is_available: boolean;
    declare notes: string | null;
}

SpecialAvailability.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        doctor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        slot_duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Duration in minutes",
        },

        is_available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "special_availability",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default SpecialAvailability;