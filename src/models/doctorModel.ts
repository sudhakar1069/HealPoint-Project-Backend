import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export interface DoctorAttributes {
    id?: number;
    user_id: number;
    specialization: string;
    experience_years: number;
    consultation_fee: number;
    bio: string;
    education: string;
    is_first_login: boolean;
    password_changed_at: Date;

}

export interface DoctorCreationAttributes
    extends Optional<
        DoctorAttributes,
        "id" | "is_first_login" | "password_changed_at"> { }

class Doctor extends Model<
    DoctorAttributes,
    DoctorCreationAttributes
> implements DoctorAttributes {

    declare id: number;
    declare user_id: number;
    declare specialization: string;
    declare experience_years: number;
    declare consultation_fee: number;
    declare education: string;
    declare bio: string;
    declare is_first_login: boolean;
    declare password_changed_at: Date;

}

Doctor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        specialization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        education: {
            type: DataTypes.STRING,
            allowNull: true
        },

        experience_years: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        consultation_fee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        
        is_first_login: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        password_changed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

    },
    {
        sequelize,
        tableName: "doctors",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Doctor;