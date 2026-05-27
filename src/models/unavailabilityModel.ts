import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface DoctorUnavailabilityAttributes {
    id?: number;
    doctor_id: number;
    unavailable_date: string;
    reason?: string | null;
    is_full_day?: boolean;
    start_time?: string | null;
    end_time?: string | null;

}

interface DoctorUnavailabilityCreationAttributes extends Optional<
    DoctorUnavailabilityAttributes, | "id" | "reason" | "is_full_day" | "start_time" | "end_time"> { }

class DoctorUnavailability extends Model<
    DoctorUnavailabilityAttributes,
    DoctorUnavailabilityCreationAttributes
>
    implements DoctorUnavailabilityAttributes {
    declare id: number;
    declare doctor_id: number;
    declare unavailable_date: string;
    declare reason: string | null;
    declare is_full_day: boolean;
    declare start_time: string | null;
    declare end_time: string | null;

}

DoctorUnavailability.init(
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

        unavailable_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        is_full_day: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        start_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        end_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "doctor_unavailabilities",
        modelName: "DoctorUnavailability",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default DoctorUnavailability;