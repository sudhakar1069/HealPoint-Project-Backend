import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";


export interface userAttributes {
    id?: number,
    name: string,
    phone_number: string,
    email: string,
    profile_picture?: string | null;
    role: "admin" | "doctor" | "patient",
    password: string,
    gender: "Male" | "Female" | "Others"
    refresh_token: string | null
    reset_password_otp?: string | null
    reset_password_expires?: Date | null
    otp_verified?: boolean
}

export interface userCreationAttributes
    extends Optional<
        userAttributes,
        | "id"
        | "refresh_token"
        | "profile_picture"
        | "reset_password_otp"
        | "reset_password_expires"
        | "otp_verified"
    > { }

export class User extends Model<userAttributes, userCreationAttributes>
    implements userAttributes {

    declare id: number;
    declare name: string;
    declare phone_number: string;
    declare email: string;
    declare profile_picture?: string | null;
    declare dob: string;
    declare gender: "Male" | "Female" | "Others";
    declare role: "admin" | "doctor" | "patient";
    declare password: string;
    declare refresh_token: string | null;
    declare reset_password_otp: string | null;
    declare reset_password_expires: Date | null;
    declare otp_verified?: boolean;
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
        allowNull: true
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
    },
    reset_password_otp: {
        type: DataTypes.STRING(6),
        allowNull: true
    },

    reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    otp_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})

export default User;