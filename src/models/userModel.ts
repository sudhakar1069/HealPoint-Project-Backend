import { DataTypes, Model, type Optional } from "sequelize";

import { sequelize } from "../config/db.js";


export interface userAttributes {
    id?: number,
    name: string,
    phone_number: string,
    email: string,
    profile_picture?: string|null;
    role: "admin" | "doctor" | "patient",
    password: string,
    gender: "Male" | "Female" | "Others"
    refresh_token: string | null
}
export interface userCreationAttributes
    extends Optional<userAttributes, "id"| "refresh_token"|"profile_picture"> { }

export class User extends Model<userAttributes, userCreationAttributes>
    implements userAttributes {
    declare id: number;
    declare name: string;
    declare phone_number: string;
    declare email: string;
    declare profile_picture?: string|null;
    declare dob: string;
    declare gender: "Male" | "Female" | "Others";
    declare role: "admin" | "doctor" | "patient";
    declare password: string;
    declare refresh_token: string | null;

}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM("Male", "Female", "Others"),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull:true
    },
    role: {
        type: DataTypes.ENUM("admin", "doctor", "patient"),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})