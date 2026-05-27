import { DataTypes, Model, type Optional } from "sequelize";

import { sequelize } from "../config/db.js";

interface DoctorAvailabilityAttributes {
    id?: number;
    doctor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    break_start?: number|null;
    break_end?: number|null;
    is_active?: number;
}

interface DoctorAvailabilityCreationAttributes
    extends Optional<DoctorAvailabilityAttributes, "id"|"break_start"|"break_end"|"is_active"> { }

class DoctorAvailability extends Model<
    DoctorAvailabilityAttributes,
    DoctorAvailabilityCreationAttributes
> implements DoctorAvailabilityAttributes {

    declare id: number;
    declare doctor_id: number;
    declare day_of_week: string;
    declare start_time: string;
    declare end_time: string;
    declare slot_duration: number;
    declare break_start: number;
    declare break_end: number;
    declare is_active: number;
}

DoctorAvailability.init(
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

        day_of_week: {
            type: DataTypes.ENUM(
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ),
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

        break_start: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        break_end: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: "availability",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);
export default DoctorAvailability;