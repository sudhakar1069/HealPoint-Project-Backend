import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export interface PatientAttributes {
    id?: number;
    user_id: number;
    dob?: string | null;
    age: number | null;
    is_active: boolean;
    blood_group: string | null;
    address: string | null;
}

export interface PatientCreationAttributes
    extends Optional<PatientAttributes, "id" | "dob" | "is_active"> { }

export class Patient
    extends Model<PatientAttributes, PatientCreationAttributes>
    implements PatientAttributes {

    declare id: number;
    declare user_id: number;
    declare dob: string | null;
    declare age: number | null;
    declare is_active: boolean;
    declare blood_group: string | null;
    declare address: string | null;
}

Patient.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },

        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        blood_group: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "patients",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default Patient;